import { Component, OnInit, AfterContentInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Force from 'd3-force';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as Occurences from 'Occurences';


import { WORDS } from './words';
import { NavigationService } from 'src/app/navigation.service';

@Component({
  selector: 'app-query-visual',
  templateUrl: './query-visual.component.html',
  styleUrls: ['./query-visual.component.css']
})
export class QueryVisualComponent implements OnInit, AfterContentInit {

  private height: number;
  private width: number;
  private svg: any;
  private circles: any;
  private text: any;
  private ratioScale = d3Scale
  .scaleSqrt()
  .domain([1, 6])
  .range([30, 150]);

  // Variable used for the word freq counter:
  private rawText = 'Hello this is a test bla bla bla, heine heine heine, how are you doing bla bla bla this is fun fun fun';
  private textOccurrences;
  private statsArray;



  private simulation: any;

  constructor(private navigationservice: NavigationService) {
    navigationservice.setNavi = false;
    this.height = 500;
    this.width = 500;

  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.countWords(this.rawText);
    this.InitSVG();
    this.DrawCirles();
  }



  private InitSVG() {
    this.svg = d3.select('svg')
      .attr('height', this.height)
      .attr('width', this.width)
      .append('g')
      .attr('transform', 'translate(250,250)');
  }

  private DrawCirles() {

    this.circles = this.svg.selectAll('.words')
      .data(this.statsArray)
      .enter()
      .append('circle')
      .attr('class', 'words')
      .attr('r', (d) => this.ratioScale(d.number))
      .attr('fill', 'lightblue');
    this.text = this.svg.selectAll('.text')
      .data(this.statsArray)
      .enter()
      .append('text')
      .text((d) => d.word);
    this.RunSimulation();
  }
  private ticked() {
    console.log(this.circles);
    console.log('run ticked');
    this.circles
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
    this.text
      .attr('x', (d) => d.x)
      .attr('y', (d) => d.y);
  }

  private RunSimulation() {
    this.simulation = d3Force.forceSimulation()
      .force('x', d3Force.forceX(0).strength(0.05))
      .force('y', d3Force.forceY(0).strength(0.05))
      .force('collide', d3Force.forceCollide((d) => this.ratioScale(d.number)))
      .nodes(this.statsArray)
      .on('tick', () => this.ticked());
  }

  private countWords(text: string) {
    this.textOccurrences = new Occurences(text);
    this.statsArray = Object.keys(this.textOccurrences.stats).map(key => {
      return { word: key, number: this.textOccurrences.stats[key] };
    });
    console.log(this.statsArray);
    console.log(WORDS);
  }
}