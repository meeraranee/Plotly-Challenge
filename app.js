function buildPlot(id) {
    // Build horizontal bar chart
    // Use d3 library to load in "samples.json" data
    d3.json("samples.json").then((data) => {
        console.log(data);

        // Filter by id
        var samples = data.samples.filter(d => d.id.toString() === id)[0];
        console.log(samples);

        // Select top 10
        var sample_values = samples.sample_values.slice(0, 10).reverse();
        console.log(sample_values);

        var otu_ids = samples.otu_ids.slice(0, 10).reverse().map(d => "OTU" + d);
        console.log(otu_ids);

        var otu_labels = samples.otu_labels.slice(0, 10).reverse();

        // Create array
        var trace1 = {
            type: "bar",
            x: sample_values,
            y: otu_ids,
            text: otu_labels,
            orientation: "h"
        };

        var data = [trace1];

        var layout = {
            title: "Top 10 OTUs Found",
            xaxis: {
                title: "Sample Values"
            },
            yaxis: {
                title: "OTU IDs"
            }
        };

        Plotly.newPlot("bar", data, layout);

        // Build bubble chart
        var trace2 = {
            x: samples.otu_ids,
            y: samples.sample_values,
            text: samples.otu_labels,
            mode: "markers",
            marker: {
                size: samples.sample_values,
                color: samples.otu_ids
            }
        };

        var data = [trace2];
    
        var layout = {
            title: "Samples",
            xaxis: {
                title: "Samples"
            },
            yaxis: {
                title: "Sample Values"
            }
        };

        Plotly.newPlot("bubble", data, layout);
    });
};

// Display metadata
function showMetadata(id) {
    d3.json("samples.json").then((data) => {
        console.log(data);

        var meta = data.metadata;
        console.log(meta);

        var metaInfo = meta.filter(dd => dd.id.toString() === id)[0];
        
        var demo = d3.select("#sample-metadata");

        demo.html("");

        Object.entries(metaInfo).forEach(([key, value]) => {
            var cell = demo.append('p');
            cell.text(`${key}: ${value}`);
        })
    });
};

// Initialize function
function init() {

    var dropdownMenu = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        console.log(data);

        data.names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });
    
        var samp = data.names[0];
        buildPlot(samp);
        showMetadata(samp);
    });
};

// Change event function
function optionChanged(change) {
    buildPlot(change),
    showMetadata(change)
};

// Initialize
init();