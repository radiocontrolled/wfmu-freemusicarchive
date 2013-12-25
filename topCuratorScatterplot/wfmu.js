//width and height of the canvas
var w =  document.body.clientWidth;
var h =  document.body.clientHeight;
var r = 7;
var padding = 100;


/* 
 * How many curators are contributing playlists to the Free Music Archive?
 */

/*
 * grab json file of recent tracks added to the FMA archive
 * see http://freemusicarchive.org/api/docs/ for more details
 */
function requestCurators() {
  d3.jsonp("http://freemusicarchive.org/api/get/curators.jsonp?callback=foo&limit=200&sort_by=curator_playlists&sort_dir=desc");
}

function foo(data){
	
	var color = d3.scale.category10(); 
        
        var result = {};
        for(var i = 0; i < data.dataset.length; i++){
                
                /*
                 * count the # of times a curator appears
                 * store it in the result object
                 */
                if(!result[data.dataset[i].curator_playlists])
        		 result[data.dataset[i].curator_playlists] = 0;
                 ++result[data.dataset[i].curator_playlists];
        }
	
	    var scatterCoordinates = []; 
		for( var i in result ) {
	    	
	    		/*
	    		 * convert the result object into an array
	    		 * change the key from a string to an integer
	    		 */
	       		scatterCoordinates.push([result[i],parseInt(i)]);
	    	
	    }

	 //make an SVG element and append it to the article
	 var svg = d3.select("article")
		.append("svg")
	    .attr("viewBox", "0 0 " + w + " " + h )
        .attr("preserveAspectRatio", "xMidYMid meet");
        
    
    /* 
     * create the circles of the scatterplot
     * 0 value is the number of people
     * 1 value is the number of curator playlists
     */
    
    //scales 
    var xScale = d3.scale.linear()
		.domain([0, d3.max(scatterCoordinates, function(d) { return d[1]; })])
        .range([0 + padding, w-padding]);
    
    var yScale = d3.scale.linear()
    	.domain([1, d3.max(scatterCoordinates, function(d) { return d[0]+2; })])
        .range([0 + padding, h]);
            
    var yAxisScale = d3.scale.linear()
    	.domain([1, d3.max(scatterCoordinates, function(d) { return d[0]; })])
        .range([h-padding,0]);
    
    
    var circles = svg.selectAll("circle")
    	.data(scatterCoordinates)
    	.enter()
    	.append("circle")
    	.attr("cx", function(d) {
        	//return d[0];
	   		return xScale(d[1]);
	   	})
	    .attr("cy", function(d) {
	       // return d[1];
	       return h - yScale(d[0]);
	   	})
	    .attr("r", r)
	    .style("fill", function(d,i){
			return color(Math.floor((d[1])));
		});

	var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
    
    svg.append("g")
        .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("class","axis")
    	.call(xAxis);
    	
    var yAxis = d3.svg.axis()
        .scale(yAxisScale)
        .orient("left");
       
	svg.append("g")
   		.attr("class", "axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
        
    svg.append("text")
    	.attr("text-anchor", "end")
    	.attr("x", w-padding)
    	.attr("dy", "-4em")
    	.attr("y", h)
    	.attr("class","axis")
    	.text("Number of Free Music Archive playlists")
    	
	
	svg.append("text")
    	.attr("class", "y label")
    	.attr("text-anchor", "end")
    	.attr("y", 6)
    	.attr("dy", "4em")
    	.attr("transform", "rotate(-90)")
    	.attr("class", "axis")
    	.text("Number of Free Music Archive curators")
}

requestCurators();