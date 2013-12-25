
//width and height of the canvas
var w =  document.body.clientWidth;
var h =  document.body.clientHeight;
var r = 20;

/*
 * grab json file of recent tracks added to the FMA archive
 * see http://freemusicarchive.org/api/docs/ for more details
 */
function requestRecentTracks() {
  d3.jsonp("http://freemusicarchive.org/recent.jsonp?callback=foo");
}

function foo(data){
	
	var color = d3.scale.category20();
	
	//make an SVG element and append it to the article
	 var svg = d3.select("article")
		.append("svg")
	    .attr("viewBox", "0 0 " + w + " " + h )
        .attr("preserveAspectRatio", "xMidYMid meet");
	
	//add circles for every new track	
   	var nodes = svg.selectAll("circle")
		.data(data.aTracks)
		.enter()
		//.append("svg:a")
		//.attr("xlink:href", function(d){return d.track_url;}) 
		.append("circle").attr("r",r)
		/*colour of node is function of d.artist_id*/
		.style("fill", function(d,i){
			return color(Math.floor((d.artist_id)*400));
		});
		
		        
	 //initialize a force layout
	 var force = d3.layout.force()
     	.nodes(data.aTracks)
     	.size([w, h])
        .linkDistance([400]) 
        .charge([-430])       
    	.start();
    
    
    // Create labels for nodes 
	var labels = svg.selectAll("text")
		.data(data.aTracks)
		.enter()
		.append("text")
		.text(function(d){
			return d.artist_name + " - " + "'" + d.track_title+"'";
			
		})
		/* give labels the same look & feel of 'FMU music archive*/
		.attr("class","fmu");
	
	
    
    force.on("tick", function() {

	  	nodes.attr("cx", function(d) { return d.x; })
	      .attr("cy", function(d) { return d.y; })
	      .call(force.drag); //let the nodes be draggable.
		
		labels.attr("x", function(d){ return d.x; })
	    	 .attr("y", function(d){return d.y});
		});

}

requestRecentTracks();