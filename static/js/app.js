// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    var metadata = data.metadata;
    var result = metadata.filter(sampleObj => sampleObj.id == sample)[0];
    var panel = d3.select("#sample-metadata");
    panel.html("");
    Object.entries(result).forEach(([key, value]) => {
      panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  }).catch(error => {
    console.error('Error fetching the metadata:', error);
  });
}

// Function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    var samples = data.samples;
    var result = samples.filter(sampleObj => sampleObj.id === sample)[0];
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;

    // Bubble Chart
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      hovermode: 'closest',
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Number of Bacteria' }
    };
    var bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Bar Chart
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    var barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: yticks,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];
    var barLayout = {
      title: 'Top 10 Bacterial Cultures Found',
      margin: { t: 30, l: 150 }
    };
    Plotly.newPlot('bar', barData, barLayout);
  }).catch(error => {
    console.error('Error fetching or building charts:', error);
  });
}

// Initialize dashboard
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    var sampleNames = data.names;
    var dropdown = d3.select("#selDataset");
    sampleNames.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  }).catch(error => {
    console.error('Error initializing the dashboard:', error);
  });
}

// Event listener for new sample selection
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Start the dashboard
init();
