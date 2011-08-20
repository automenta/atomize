var procRDFData = $.rdf.databank()
  .prefix('foaf', 'http://xmlns.com/foaf/0.1/')
  .prefix('dc', 'http://purl.org/dc/elements/1.1/')
  .prefix('dct', 'http://purl.org/dc/terms/')
  .prefix('xsd', 'http://www.w3.org/2001/XMLSchema#')
  .add('<http://example.com/aReallyGreatBook> dc:title "A Really Great Book" .')
  .add('<http://example.com/aReallyGreatBook> dc:creator _:creator .')
  .add('_:creator a foaf:Person .')
  .add('_:creator foaf:name "John Doe" .')
  .add('<http://example.com/aReallyGreatBook> dct:issued "2004-01-19"^^xsd:date .')

var procRDFGraph = new AGraph().loadDataBank(procRDFData);

var nameGraph = new AGraph();
{
    var dennis = nameGraph.newNode({label: 'Dennis'});
    var michael = nameGraph.newNode({label: 'Michael'});
    var jessica = nameGraph.newNode({label: 'Jessica'});
    var timothy = nameGraph.newNode({label: 'Timothy'});
    var barbara = nameGraph.newNode({label: 'Barbara'});
    var franklin = nameGraph.newNode({label: 'Franklin'});
    var monty = nameGraph.newNode({label: 'Monty'});
    var james = nameGraph.newNode({label: 'James'});
    var bianca = nameGraph.newNode({label: 'Bianca'});
     
    nameGraph.newEdge(dennis, michael, {color: '#00A0B0', label: 'childOf'});
    nameGraph.newEdge(michael, dennis, {color: '#6A4A3C', label: 'fatherOf'});
    nameGraph.newEdge(michael, jessica, {color: '#CC333F'});
    nameGraph.newEdge(jessica, barbara, {color: '#EB6841'});
    nameGraph.newEdge(michael, timothy, {color: '#EDC951'});
    nameGraph.newEdge(franklin, monty, {color: '#7DBE3C'});
    nameGraph.newEdge(dennis, monty, {color: '#000000'});
    nameGraph.newEdge(monty, james, {color: '#00A0B0'});
    nameGraph.newEdge(barbara, timothy, {color: '#6A4A3C'});
    nameGraph.newEdge(dennis, bianca, {color: '#CC333F'});
    nameGraph.newEdge(bianca, monty, {color: '#EB6841'});
}