<?php
//$url = 'http://localhost:8890/proxy/rdf/http://localhost:8890/dataspace/person/dba?output-format=ttl';

$url = $_GET['url'];

//$url = "http://dbpedia.org/data/Access-eGov.ntriples";

    
?>

<html>
    <head>

        <meta charset="utf-8">
        <title><? echo $url; ?></title>

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



       
<?php

function startsWith($haystack, $needle) {
    $length = strlen($needle);
    return (substr($haystack, 0, $length) === $needle);
}

function endsWith($haystack, $needle) {
    $length = strlen($needle);
    $start  = $length * -1; //negative
    return (substr($haystack, $start) === $needle);
}


if ($fp = fopen($url, 'r')) {
    $content = '';
    // keep reading until there's nothing left 
    while ($line = fread($fp, 1024)) {
        $content .= $line;
    }

    //echo $content;

    $tags = explode("\n", $content);

    for ($i = 0; $i < count($tags); $i++) {
        $t = trim($tags[$i]);
        
        $caret = strpos($t, "^^");
        if ($caret!=false) {
            $t = substr($t, 0, $caret) . ' .';
        }
        
        $l = addslashes($t);
        
        if (strlen($l) > 0)        
            echo 'rdfdata.add("' . $l . '");  ';
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


