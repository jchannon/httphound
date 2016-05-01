var restify = require('restify');
var halfred = require('halfred');
var hal = require('hal');

halfred.enableValidation();

var fs = require('fs');
var data = JSON.parse(fs.readFileSync('statuscodes.json', 'utf8'));

function getPaginatedItems(items, offset) {
    //var page = pageNumber || 1;
    var per_page = 10;
    //var offset = (page - 1) * per_page,
    var paginatedItems = items.slice(offset, offset + per_page);

    return {
        //page: page,
        //per_page: per_page,
        total: items.length,
        //total_pages: Math.ceil(items.length / per_page),
        data: paginatedItems
    };
}

function respond(req, res, next) {
    var item = data.filter(function(item) {
        return item.code == req.params.id;
    });

    if (item.length == 0) {
        res.send(404);
        return next();
    }

    var halItem = new hal.Resource(item[0], "/" + item[0].code);
    halItem.link(new hal.Link("index", "/"));
    
    var resource = halfred.parse(halItem);
    var issues = resource.validationIssues();
    if (issues.length) {
        res.send(issues);
    } else {
        res.send(halItem);
    }
    next();
}

function home(req, res, next) {
    var offset = 0; 
    if (req.query.offset) {
        offset = parseInt(req.query.offset, 10);
    }

    var pagedData = getPaginatedItems(data, offset);
    var halPagedData = [];
    pagedData.data.forEach(function logArrayElements(element, index, array) {
        halPagedData.push(new hal.Resource(element, "/" + element.code));
    });

    var resource = new hal.Resource({
        total: pagedData.total
    }, '/');
    
    if (offset >= 0 && offset <= pagedData.total - 20){
      resource.link(new hal.Link("next", "/?offset="+(offset+10)));
    }
    if (offset >= 10 && offset <= pagedData.total - 10){
      resource.link(new hal.Link("prev", "/?offset="+(offset-10)));
    }
    resource.embed("statuses", halPagedData);

    res.send(resource);
    next();
}

var server = restify.createServer({
    formatters: {
        'application/hal+json': restify.formatters['application/json; q=0.4']
    }
});
server.use(restify.queryParser());
server.use(restify.CORS());

server.get('/', home);

server.get('/:id', respond);

server.listen(8080, function() {
    console.log('%s listening at %s', server.name, server.url);
});