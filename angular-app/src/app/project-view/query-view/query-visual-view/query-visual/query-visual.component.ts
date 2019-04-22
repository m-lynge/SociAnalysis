import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Force from 'd3-force';

import { WORDS } from './words';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  selector: 'app-query-visual',
  templateUrl: './query-visual.component.html',
  styleUrls: ['./query-visual.component.css']
})
export class QueryVisualComponent implements OnInit {

  private height: number;
  private width: number;
  private svg: any;
  private circles: any;
  private chart: any;

  private simulation: any;

  constructor(private navigationservice: NavigationService) {
    navigationservice.setNavi = false;
    this.height = 500;
    this.width = 500;

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
    this.circles = this.svg.selectAll('.words')
      .data(WORDS)
      .enter()
      .append('circle')
      .attr('class', 'words')
      .attr('r', 10)
      .attr('fill', 'lightblue');
    
    console.log(this.circles);
    this.RunSimulation();

  }
  private ticked() {
    console.log(this.circles);
    console.log('run ticked');
    this.circles
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  }

  private RunSimulation() {
    this.simulation = d3Force.forceSimulation()
      .force('charge', d3Force.forceManyBody().strength([-50]))
      .force('x', d3Force.forceX(0))
      .force('y', d3Force.forceY(0))
      .nodes(WORDS)
      .on('tick', this.ticked());
  }


}
