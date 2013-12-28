
/**
 * @author Alison Benjamin
 */

var articleWidth = $(window).width();
var w = ($(window).width()/1.5);
var h = w/1.6; 
var color = d3.scale.category20c(); 

var svg = d3.select("article")  
	.attr("width", articleWidth)
	.append("svg")
	.attr({
		"width": articleWidth,
		"height" : h
	})
	.append("g")
	.attr("transform", "translate(50,50)");
	
var tree = d3.layout.tree()
	.size([w/2,h])

d3.json("wfmuAPI.json", function(data){
	var nodes = tree.nodes(data);
	var links = tree.links(nodes);
	
	
	var node = svg.selectAll("node")
		.data(nodes)
		.enter()
		.append("g")
			.attr("class",".node")
			//placing the nodes
			.attr("transform", function(d){
				return "translate(" + d.y  + "," + d.x + ")";
			})
	
		
	var diagonal = d3.svg.diagonal()
		.projection(function(d){return [d.y-4, d.x]})
	
	svg.selectAll("node")
		.data(links)
		.enter()
		.append("path")
		.attr({
			"class":"link",
			"fill":"none",
			"d":diagonal
		})
		.attr("stroke", "#FF6600")

	//add a circle to each node. 
	node.append("circle")
		.attr("r",5)
		
	node.append("text")
		.text(function(d){
			return d.name;
		})
		.attr({
			"text-anchor":top,
			"transform":function(d){
				return  "translate(10,5)";
			}
		})
	
	//position the label for the parent node
	$("text:first").attr("transform", function(){
			return  "translate(-10,-15)";
		})

})




