import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Array from 'd3-array';
import * as d3Axis from 'd3-axis';
import * as d3Force from 'd3-force';

import { WORDS } from './words';
import { style } from '@angular/animations';
import { anchorDef } from '@angular/core/src/view';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  selector: 'app-query-visual',
  templateUrl: './query-visual.component.html',
  styleUrls: ['./query-visual.component.css']
})
export class QueryVisualComponent implements OnInit {

  height = 500;
  width = 500;
  private svg: any;
  private circles: any;
  private chart: any;

  private simulation = d3Force.forceSimulation()
  .force('x', d3Force.forceX(this.width / 2).strength(0.5))
  .force('y', d3Force.forceY(this.height / 2).strength(0.5));

  constructor(private navigationservice: NavigationService) {
    navigationservice.setNavi = false;
  }

  ngOnInit(): void {
    this.InitSVG();
    this.DrawCirles();
  }



  private InitSVG() {
    this.svg = d3.select('svg')
      .attr('height', this.height)
      .attr('width', this.width)
      .append('g')
      .attr('transform', 'translate(0,0)');
  }

  private DrawCirles() {
    this.circles = this.svg.selectAll('.WORDS')
      .data(WORDS)
      .enter()
      .append('circle')
      .attr('class', 'words')
      .attr('r', 10)
      .attr('fill', 'lightblue');
    this.simulation.nodes(WORDS)
      .on('tick', this.ticked());


  }
  private ticked() {
    console.log("run ticked");
    this.circles
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  }


}
