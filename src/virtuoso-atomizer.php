<html>
<head>
    
    <meta charset="utf-8">
    <title>X3DOM text example</title>
    
    <link href='x3dom/x3dom.css' rel='stylesheet' type='text/css'>
        
    <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"></script>
    <script src="rdfquery/jquery.rdfquery.core.min-1.0.js"></script>

    <script src="x3dom/x3dom.js"></script>   
    <script src="springy/springy.js"></script>
    
    <link href="atomize.css" rel='stylesheet' type='text/css' >
    <script src="atomize.js"></script>

</head>


<body id="main" style="color:white; background-color: black; margin:0; padding:0px;">

    <div id="content"></div>
    
    <script>
	var rdfdata;

        $(function(){
		rdfdata = $.rdf.databank()
		  .base('http://www.example.org/');
		  //.prefix('dc', 'http://purl.org/dc/elements/1.1/')
//		  .prefix('foaf', 'http://xmlns.com/foaf/0.1/');



			<?php
			$url = 'http://localhost:8890/proxy/rdf/http://localhost:8890/dataspace/person/dba?output-format=ttl';

			if ($fp = fopen($url, 'r')) {
			   $content = '';
			   // keep reading until there's nothing left 
			   while ($line = fread($fp, 1024)) {
			      $content .= $line;
			   }

			   //echo $content;

			   $tags = explode(" .", $content);
			   
			   for($i=0;$i<count($tags);$i++) {
			      $t = trim($tags[$i]);
			      if (strlen($t)==0) continue;
 			      $t = $t . ' .';

		              if ($t[0] == '@') {
				//TODO add namespace
				//@prefix rdf:	<http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
				//  --TO--
   			        //rdfdata.prefix('foaf', 'http://xmlns.com/foaf/0.1/');

				//TODO check for @prefix, not just any '@'

				$xparts = explode(" ", $t);
				$parts = explode("\t", $xparts[1]);

				$ns = str_replace(":", "", $parts[0]);

				$url = $parts[1];
				$url = str_replace("<", "", $url);
				$url = str_replace(">", "", $url);
				 echo 'rdfdata.prefix("' . $ns . '", "' . $url . '");';
                              }
			      else {
				 if (strpos($t, ";")==false) {

					 $t = str_replace("\t", " ", $t);
					 $t = str_replace("\n", " ", $t);

					//TODO
					//Repetition of another object for the same subject and predicate using a comma ","
					//Repetition of another predicate for the same subject using a semicolon ";"


	   			         echo 'rdfdata.add("' . addslashes($t) . '");  ';
				}
				else {
					//extract ;
				}
                              }
			   
			   }

			} else {
			   echo 'ERROR';
			}
			?>


              var graph = new AGraph().loadDataBank(rdfdata);
              var space = new3DSpace('#content', '100%', '100%');
              var layout = graphLayout('#content', graph);            

        });

    </script>
    
 </body>
</html>


