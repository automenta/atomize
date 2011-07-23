/**
Copyright (c) 2010 Dennis Hotson

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
*/
function addText(n, text, x, y ,z) {
    var t = document.createElement('Transform');
    {
        t.setAttribute("translation", x + " " + y + " " + z );
        t.setAttribute("scale", "1 1 1" );

        var s = document.createElement('Shape');
        t.appendChild(s);

        {
            var a = document.createElement('Appearance');
            s.appendChild(a);
            
            var m = document.createElement('Material');
            m.setAttribute('ambientIntensity', '0.0933');
            m.setAttribute('diffuseColor', '0.1 0.1 0.1');
            m.setAttribute('shininess', '0.25');
            m.setAttribute('specularColor', '0.46 0.46 0.46');
            a.appendChild(m);
            //<material ambientIntensity='0.0933' diffuseColor='0.32 0.54 0.26' shininess='0.51' specularColor='0.46 0.46 0.46'></material>
            
        }
        var txt = document.createElement('Text');
        txt.setAttribute('string', text);
        txt.setAttribute('solid', 'false');
        {
            var fs = document.createElement('fontstyle');
            fs.setAttribute('family', "ARIAL");
            fs.setAttribute('style', "BOLD");
            fs.setAttribute('size', "32");
            txt.appendChild(fs);
        }
        s.appendChild(txt);            

        /*    <shape>
                <appearance>
                  <material ambientIntensity='0.0933' diffuseColor='0.32 0.54 0.26' shininess='0.51' specularColor='0.46 0.46 0.46'></material>
                </appearance>
                <text string='Mono bolditalic 32px' solid='false'>
                    <fontstyle family="TYPEWRITER" style="BOLDITALIC" size="32"></fontstyle>
                </text>
              </shape>*/

    }

    n.appendChild(t);

    return t;

}


function nodeClicked(nodeId) {
    //alert('node clicked: ' + nodeId);
}

(function() {

jQuery.fn.springyx3dom = function(params) {
    var graph = params.graph;
    if(!graph){
        return null;
    }
    
    var stiffness = params.stiffness || 400.0;
    var repulsion = params.repulsion || 400.0;
    var damping = params.damping || 0.5;

    var rootTransform = this[0];
    
    var layout = new SLayout.ForceDirected(graph, stiffness, repulsion, damping);

    var radius = 4;
    
    // calculate bounding box of graph layout.. with ease-in
    var currentBB = layout.getBoundingBox();
    var targetBB = {bottomleft: new Vector(-radius/2.0, -radius/2.0), topright: new Vector(radius/2.0, radius/2.0)};
    
    var vertexToShape = new Array();
    var edgeToShape = new Array();

    // auto adjusting bounding box
    setInterval(function(){
            targetBB = layout.getBoundingBox();
            // current gets 20% closer to target every iteration
            currentBB = {
                    bottomleft: currentBB.bottomleft.add( targetBB.bottomleft.subtract(currentBB.bottomleft)
                            .divide(10)),
                    topright: currentBB.topright.add( targetBB.topright.subtract(currentBB.topright)
                            .divide(10))
            };
    }, 50);

    // convert to/from screen coordinates
    toScreen = function(p) {
            var size = currentBB.topright.subtract(currentBB.bottomleft);
            var sx = p.subtract(currentBB.bottomleft).divide(size.x).x * 100; //canvas.width;
            var sy = p.subtract(currentBB.bottomleft).divide(size.y).y * 100; //canvas.height;
            
            sx = sx * 0.2 - (radius*2);
            sy = sy * 0.2 - (radius*2);

            return new Vector(sx, sy);
    };

    fromScreen = function(s) {
            var size = currentBB.topright.subtract(currentBB.bottomleft);
            var px = (s.x / 111 /* canvas.width */) * size.x + currentBB.bottomleft.x;
            var py = (s.y / 111 /* canvas.height */) * size.y + currentBB.bottomleft.y;
            return new Vector(px, py);
    };

    // half-assed drag and drop
    //var selected = null;
    //var nearest = null;
    //var dragged = null;

//    jQuery(canvas).mousedown(function(e){
//            jQuery('.actions').hide();
//
//            var pos = jQuery(this).offset();
//            var p = fromScreen({x: e.pageX - pos.left, y: e.pageY - pos.top});
//            selected = nearest = dragged = layout.nearest(p);
//
//            if (selected.node !== null)
//            {
//                    dragged.point.m = 10000.0;
//            }
//
//            renderer.start();
//    });
//
//    jQuery(canvas).mousemove(function(e){
//            var pos = jQuery(this).offset();
//            var p = fromScreen({x: e.pageX - pos.left, y: e.pageY - pos.top});
//            nearest = layout.nearest(p);
//
//            if (dragged !== null && dragged.node !== null)
//            {
//                    dragged.point.p.x = p.x;
//                    dragged.point.p.y = p.y;
//            }
//
//            renderer.start();
//    });
//
//    jQuery(window).bind('mouseup',function(e){
//            dragged = null;
//    });
//
//    Node.prototype.getWidth = function() {
//            ctx.save();
//            var text = typeof(this.data.label) !== 'undefined' ? this.data.label : this.id;
//            ctx.font = "16px Verdana, sans-serif";
//            var width = ctx.measureText(text).width + 10;
//            ctx.restore();
//            return width;
//    };
//
//    Node.prototype.getHeight = function() {
//            return 20;
//    };
    var drawn = new Array();

    var renderer = new Renderer(1, layout,
            function clear()
            {
                    //ctx.clearRect(0,0,canvas.width,canvas.height);
                    drawn = new Array();
            },
            
            function drawEdge(edge, p1, p2)
            {
                //alert('adding edge: ', edge);
                
                    var x1 = toScreen(p1).x;
                    var y1 = toScreen(p1).y;
                    var x2 = toScreen(p2).x;
                    var y2 = toScreen(p2).y;

                    var direction = new Vector(x2-x1, y2-y1);
                    var normal = direction.normal().normalise();

                    var from = graph.getEdges(edge.source, edge.target);
                    var to = graph.getEdges(edge.target, edge.source);
                    
                    //alert('drawing edge: ' + edge + ' ' + edge.source.data.label + ' ' + edge.target.data.label);
                    
                    var updateNode = function(node, x, y) {     
                        var label = node.data.label;
                        if (vertexToShape[label] == undefined) {
                            //alert('adding node: ' + label + " " + vertexToShape.length);
                            vertexToShape[label] = true;


                            s0 = 1.5; //Math.random() + 0.5;
                            s1 = 1.0; //Math.random() + 0.5;
                            s2 = 0.2; //Math.random() + 0.5;

                            var t = document.createElement('Transform');
                            t.id = 'transform.' + label;
                            t.setAttribute("scale", s0 + " " + s1 + " " + s2 );
                            
                            var s = document.createElement('Shape');
                            t.appendChild(s);
                            
                            var b = document.createElement('Box');
                            s.appendChild(b);
                            
                            var ot = document.getElementById('root');
                            ot.appendChild(t);
                            
                            var textNode = addText(t, label, 0, 0, 2);
                            
                            
                            var eventString = 'nodeClicked(\"' + label + "\")";
                            b.setAttribute('onclick', eventString );
                            textNode.setAttribute('onclick', eventString );
                            

                        }
                        
                        var tt = document.getElementById('transform.' + label);
                        tt.setAttribute("translation", x + " " + y + " 0");
                        
                    };
                    
                    if (drawn[edge.source.data.label] != true) {
                        updateNode(edge.source, x1, y1);
                        drawn[edge.source.data.label] = true;
                    }
                    if (drawn[edge.target.data.label] != true) {
                        updateNode(edge.target, x2, y2);
                        drawn[edge.target.data.label] = true;
                    }

                    var total = from.length + to.length;

                    var n = 0;
                    for (var i=0; i<from.length; i++)
                    {
                            if (from[i].id === edge.id)
                            {
                                    n = i;
                            }
                    }
//
                    var spacing = 6.0;
//
//                    // Figure out how far off centre the line should be drawn
                      var offset = normal.multiply(-((total - 1) * spacing)/2.0 + (n * spacing)).multiply(0.2);
//
                      var s1 = toScreen(p1).add(offset);
                      var s2 = toScreen(p2).add(offset);
//  
//                    //var boxWidth = edge.target.getWidth();
//                    //var boxHeight = edge.target.getHeight();
//                    var boxWidth = 100;
//                    var boxHeight = 100;
//
//                    var intersection = intersect_line_box(s1, s2, {x: x2-boxWidth/2.0, y: y2-boxHeight/2.0}, boxWidth, boxHeight);
//
//                    if (!intersection) {
//                            intersection = s2;
//                    }
//
//
//                    var stroke = typeof(edge.data.color) !== 'undefined' ? edge.data.color : '#000000';
//
//                    var arrowWidth;
//                    var arrowLength;
//
//                    var weight = typeof(edge.data.weight) !== 'undefined' ? edge.data.weight : 1.0;
//
//                    ctx.lineWidth = Math.max(weight *  2, 0.1);
//                    arrowWidth = 1 + ctx.lineWidth;
//                    arrowLength = 8;
//
                    var directional = typeof(edge.data.directional) !== 'undefined' ? edge.data.directional : true;
//
//                    // line
                    var lineEnd;
                    if (directional) {
//                            lineEnd = intersection.subtract(direction.normalise().multiply(arrowLength * 0.5));
                    }
                    else {
//                            lineEnd = s2;
                    }

                    var edgeLabel = edge.source.id + '..' + edge.target.id;
                    var lineLength = Math.sqrt(s2.subtract(s1).magnitude());
                    var sx = 1.0; //width
                    var sy = lineLength; //length
                    var sz = 0.2; //depth
                    
                    x = (s1.x + s2.x) / 2.0;
                    y = (s1.y + s2.y) / 2.0;
                    
                    if (edgeToShape[edgeLabel] == undefined) {
                        
                        /**
                         * 	<Transform DEF="coneTrafo" translation="-4.5 0 0"> 
                                    <Shape DEF="coneShape"> 
                                            <Appearance DEF="coneApp"> 
                                                    <Material diffuseColor="0 1 0" specularColor=".5 .5 .5" /> 
                                            </Appearance> 
                                            <Cone DEF="cone" /> 
                                    </Shape> 
                            </Transform> 
                         */
                            
                        var t = document.createElement('Transform');
                        t.id = 'transform.' + edgeLabel;

                        var s = document.createElement('Shape');
                        t.appendChild(s);

                        var b = document.createElement('Cone');
                        s.appendChild(b);

                        var ot = document.getElementById('root');
                        ot.appendChild(t);                        
                        
                        edgeToShape[edgeLabel] = true;                        
                    }
                    
                    
                    var theta = Math.atan2((s2.y - s1.y), (s2.x - s1.x)) + 3.14159/2.0;
                    
                    var lt = document.getElementById('transform.' + edgeLabel);
                    lt.setAttribute("scale", sx + " " + sy + " " + sz );
                    lt.setAttribute("translation", x + " " + y + " 0");
                    lt.setAttribute("rotation", "0 0 1 " + theta);
                    //update edgeToShape

//
//                    ctx.strokeStyle = stroke;
//                    ctx.beginPath();
//                    ctx.moveTo(s1.x, s1.y);
//                    ctx.lineTo(lineEnd.x, lineEnd.y);
//                    ctx.stroke();
//
//                    // arrow
//
//                    if (directional)
//                    {
//                            ctx.save();
//                            ctx.fillStyle = stroke;
//                            ctx.translate(intersection.x, intersection.y);
//                            ctx.rotate(Math.atan2(y2 - y1, x2 - x1));
//                            ctx.beginPath();
//                            ctx.moveTo(-arrowLength, arrowWidth);
//                            ctx.lineTo(0, 0);
//                            ctx.lineTo(-arrowLength, -arrowWidth);
//                            ctx.lineTo(-arrowLength * 0.8, -0);
//                            ctx.closePath();
//                            ctx.fill();
//                            ctx.restore();
//                    }
            },
            function drawNode(node, p)
            {
                    var s = toScreen(p);

//                    ctx.save();

                    var boxWidth = 100;
                    var boxHeight = 100;
                    //var boxWidth = node.getWidth();
                    //var boxHeight = node.getHeight();

                    // fill background
//                    ctx.clearRect(s.x - boxWidth/2, s.y - 10, boxWidth, 20);
//
//                    // fill background
//                    if (selected !== null && nearest.node !== null && selected.node.id === node.id)
//                    {
//                            ctx.fillStyle = "#FFFFE0";
//                    }
//                    else if (nearest !== null && nearest.node !== null && nearest.node.id === node.id)
//                    {
//                            ctx.fillStyle = "#EEEEEE";
//                    }
//                    else
//                    {
//                            ctx.fillStyle = "#FFFFFF";
//                    }
//
//                    ctx.fillRect(s.x - boxWidth/2, s.y - 10, boxWidth, 20);
//
//                    ctx.textAlign = "left";
//                    ctx.textBaseline = "top";
//                    ctx.font = "16px Verdana, sans-serif";
//                    ctx.fillStyle = "#000000";
//                    ctx.font = "16px Verdana, sans-serif";
//                    var text = typeof(node.data.label) !== 'undefined' ? node.data.label : node.id;
//                    ctx.fillText(text, s.x - boxWidth/2 + 5, s.y - 8);
//
//                    ctx.restore();
            }
    );

    renderer.start();


    // helpers for figuring out where to draw arrows
    function intersect_line_line(p1, p2, p3, p4)
    {
            var denom = ((p4.y - p3.y)*(p2.x - p1.x) - (p4.x - p3.x)*(p2.y - p1.y));

            // lines are parallel
            if (denom === 0) {
                    return false;
            }

            var ua = ((p4.x - p3.x)*(p1.y - p3.y) - (p4.y - p3.y)*(p1.x - p3.x)) / denom;
            var ub = ((p2.x - p1.x)*(p1.y - p3.y) - (p2.y - p1.y)*(p1.x - p3.x)) / denom;

            if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
                    return false;
            }

            return new Vector(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
    }

    function intersect_line_box(p1, p2, p3, w, h)
    {
            var tl = {x: p3.x, y: p3.y};
            var tr = {x: p3.x + w, y: p3.y};
            var bl = {x: p3.x, y: p3.y + h};
            var br = {x: p3.x + w, y: p3.y + h};

            var result;
            if (result = intersect_line_line(p1, p2, tl, tr)) {return result;} // top
            if (result = intersect_line_line(p1, p2, tr, br)) {return result;} // right
            if (result = intersect_line_line(p1, p2, br, bl)) {return result;} // bottom
            if (result = intersect_line_line(p1, p2, bl, tl)) {return result;} // left

            return false;
    }
    
    return layout;

}

})();
