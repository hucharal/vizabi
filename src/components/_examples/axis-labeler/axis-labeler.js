define([
    'jquery',
    'd3',
    'base/component',
    'd3genericLogScale',
    'd3axisWithLabelPicker'
], function($, d3, Component) {



    var AxisLabelerDemo = Component.extend({
        init: function(context, options) {
            var _this = this;
            this.name = 'axis-labeler';
            this.template = 'components/_examples/' + this.name + '/' + this.name;

            //define expected models for this component
            this.model_expects = ["scales"];

            this._super(context, options);
            this.xAxis = d3.svg.axisSmart();
            this.yAxis = d3.svg.axisSmart();


        },




        /**
         * Executes right after the template is in place
         */
        domReady: function() {
            var _this = this;

            // reference elements
            this.graph = this.element.select('.vzb-bc-graph');
            this.xAxisEl = this.graph.select('.vzb-bc-axis-x');
            this.yAxisEl = this.graph.select('.vzb-bc-axis-y');


            //model events
            this.model.scales.on({
                'change': function() {
                console.log("Model.scales updated!");
                _this.initScales();
                _this.update();
                }
            });

            //component events
            this.on("resize", function() {
                console.log("Gotta resize!");
                _this.update();
            })

        },

        modelReady: function(evt) {
            this.initScales();
            this.update();
        },





        initScales: function(){
            this.xScale = d3.scale[this.model.scales.xScaleType]()
                .domain([this.model.scales.from, this.model.scales.to]);
            this.yScale = d3.scale[this.model.scales.yScaleType]()
                .domain([this.model.scales.from, this.model.scales.to]);
        },

        /*
         * RESIZE:
         * Executed whenever the container is resized
         */
        update: function() {
            var _this = this,
                margin,
                tick_spacing,
                padding = 2;

            switch (this.getLayoutProfile()) {
                case "small":
                    margin = {top: 30, right: 20, left: 40, bottom: 40};
                    tick_spacing = 60;
                    break;
                case "medium":
                    margin = {top: 30, right: 60, left: 60, bottom: 40};
                    tick_spacing = 80;
                    break;
                case "large":
                    margin = {top: 30, right: 60, left: 60, bottom: 40};
                    tick_spacing = 100;
                    break;
            }


            //stage
            var height = parseInt(this.element.style("height"), 10) - margin.top - margin.bottom;
            var width = parseInt(this.element.style("width"), 10) - margin.left - margin.right;

            //graph group is shifted according to margins (while svg element is at 100 by 100%)
            this.graph
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


            //update scales to the new range
            if (this.model.scales.xScaleType !== "ordinal") {
                this.xScale.range([0, width]).nice();
            } else {
                this.xScale.rangePoints([0, width], padding).range();
            }

            if (this.model.scales.yScaleType !== "ordinal") {
                this.yScale.range([height, 0]).nice();
            } else {
                this.yScale.rangePoints([height, 0], padding).range();
            }

            // measure the width of one digit
            var widthSampleG = this.xAxisEl.append("g").attr("class","tick widthSampling");
            widthSampleT = widthSampleG.append('text').text('M');
            this.axisTextFontSize = widthSampleT.style("font-size");
            this.widthOfOneDigit = widthSampleT[0][0].getComputedTextLength();
            widthSampleG.remove();

            this.xAxis.scale(this.xScale)
                .orient("bottom")
                .tickSize(6, 0)
                .smartLabeler({
                    scaleType: this.model.scales.xScaleType,
                    widthOfOneDigit: this.widthOfOneDigit,
                    cssFontSize: this.axisTextFontSize,
                    lengthWhenPivoting: margin.bottom,
                    tickSpacing: tick_spacing
                });

            this.yAxis.scale(this.yScale)
                .orient("left")
                .tickSize(6, 0)
                .smartLabeler({
                    scaleType: this.model.scales.yScaleType,
                    widthOfOneDigit: this.widthOfOneDigit,
                    cssFontSize: this.axisTextFontSize,
                    lengthWhenPivoting: margin.left,
                    tickSpacing: tick_spacing
                });

            this.xAxisEl.attr("transform", "translate(0," + height + ")");

            this.xAxisEl
                .call(this.xAxis)
                .selectAll("text")
                    .attr("transform","rotate("+(this.xAxis.pivot?-90:0)+")")
                    .style("text-anchor", this.xAxis.pivot?"end":"middle")
                    .attr("dx", this.xAxis.pivot?"-0.71em":"0.00em")
                    .attr("dy", this.xAxis.pivot?"-0.32em":"0.71em")

            this.yAxisEl
                .call(this.yAxis)
                .selectAll("text")
                    .attr("transform","rotate("+(this.yAxis.pivot?-90:0)+")")
                    .style("text-anchor", this.yAxis.pivot?"middle":"end")
                    .attr("dx", this.yAxis.pivot?"+0.71em":"0.00em")
                    .attr("dy", this.yAxis.pivot?"-0.71em":"0.32em")


        }




    });

    return AxisLabelerDemo;
});


