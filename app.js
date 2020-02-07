var basis = require("node-basis");

/*命名后端接口*/
basis.setRouter({
	"controllerName1":"/api/:id/:version",
	"controllerName2":"/",
	"interface":"/restful/info"
});

/*映射文件处理接口*/
basis.setFilter({
	"nodeFile1":"./html/a.node",
	"nodeFile2":"./html/b.jsp"
});

basis.controller("nodeFile1",function(req,res,file){
	var tpl = new basis.template();
	var items = [
		{
			name:"成dadsfsfdsfs",
			date : "1954年4月7日"
		},
		{
			name:"吴京",
			date : "1974年4月3日"
		},
		{
			name:"李连杰",
			date : "1963年4月26日"
		},
		{
			name:"史泰龙",
			date : "1946年7月6日"
		}
	];
	tpl.assign("items",items);
	tpl.render(file,res);
});

basis.controller("nodeFile2",function(req,res,file){
	var tpl = new basis.template();
	var items = [
		{
			name:"A同学",
			age : "22",
			yw:77.6,
			sx:78,
			yy:70
		},
		{
			name:"B同学",
			age : "25",
			yw:99,
			sx:80,
			yy:81
		},
		{
			name:"C同学",
			age : "21",
			yw:77.6,
			sx:88,
			yy:77
		},
		{
			name:"D同学",
			age : "19",
			yw:85,
			sx:90,
			yy:69
		},
		{
			name:"成cheng",
			age : "19",
			yw:91,
			sx:68,
			yy:70
		},

	];
	tpl.assign("items",items);
	tpl.render(file,res);
});

basis.controller("controllerName1",function(req,res,argv){
	res.writeHead(200,{'content-type':'text/html'});
	res.write("<h1>This is request.</h1>");
	res.write("<h3>params id:"+argv.id+"</h3>");
	res.write("<h3>params version:"+argv.version+"</h3>");
	res.end();
});

/*
首页
(1) http://localhost:3000/
*/
// basis.controller("controllerName2",function(req,res){
// 	res.writeHead(200,{'content-type':'text/html'});
// 	basis.outfile("./html/index.html"); /*转到html/index.html文件*/
// 	res.end();
// });



/*
restfull 接口
url is /restful/info
参见html/index.html里的ajax请求
*/
basis.controller("interface",function(req,res){
	/*向客户端输出JSON*/
	res.writeHead(200,{'content-type':'text/javascript'});
	res.write('{"data":[1,2,3,4],"errorCode":"0"}'); /*restfull接口数据*/
	res.end();
});
//basis.port = 3000;
basis.start(3000);

