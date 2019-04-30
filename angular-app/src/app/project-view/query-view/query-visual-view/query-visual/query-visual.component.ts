import { Component, OnInit, AfterContentInit } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Force from 'd3-force';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as Occurences from 'Occurences';

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
  private ratioScale: any;
  private max: any;



  // Variable used for the word freq counter:
  // tslint:disable-next-line: max-line-length
  private rawText = 'pappa, pappa, pappa, pappa, pappa. rasmus rasmus rasmus rasmus rasmus cuense to be invited to the dinner r Paisnly inmates of the monastery invited  They were alraedy waiting when Miusov  Kalganov  and Ivan arrived  The other guest  Maximov  stood a little aside  waiting also  The Father Superior stepped into the middle of the room to receive his guests  He was a tall  thin  but still vigorous old man  with black hair streakd with grey  and a long  grave  ascetic face  He bowed to his guests in silence  But this time they approaced to receive his blessing  Miusov even tried to kiss his hand  but the Father Superior drew it back in time to aboid the salute  But Ivan and Kalganov went through the ceremony in the most simple  hearted and complete manner  kissing his hand as peesants do';
  private textOccurrences: any;
  private statsArray: any;
  private sortedStatsArray;
  private simulation;

  constructor(private navigationservice: NavigationService) {
    this.navigationservice.setNavi = true;
    this.height = 500;
    this.width = 500;

  }

  ngOnInit(): void {
  }

  ngAfterContentInit(): void {
    this.countWords(this.rawText);
    this.Init();
    this.DrawCirles();
  }

  private Init() {
    this.svg = d3.select('svg')
      .attr('height', this.height)
      .attr('width', this.width)
      .style('text-anchor', 'middle')
      .append('g')
      .attr('transform', 'translate(250,250)');

    // calculate max amount of words to make the domain correct:
    this.max = this.sortedStatsArray[0].number;


    // mapping the domain to a range for calculating the correct radius for the circles
    this.ratioScale = d3Scale
      .scaleSqrt()
      .domain([1, this.max])
      .range([30, 100]);
  }

  private DrawCirles() {

    this.circles = this.svg.selectAll('.words')
      .data(this.sortedStatsArray)
      .enter()
      .append('circle')
      .attr('class', 'words')
      .attr('r', (d) => this.ratioScale(d.number))
      .attr('fill', (d) => d = 'hsl(' + Math.random() * 360 + ',50%,50%)');
    this.text = this.svg.selectAll('.text')
      .data(this.sortedStatsArray)
      .enter()
      .append('text')
      .text((d) => d.word);
    this.RunSimulation();
  }
  private ticked() {
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
      .nodes(this.sortedStatsArray)
      .on('tick', () => this.ticked());
  }

  private countWords(text: string) {
    this.textOccurrences = new Occurences(text);
    this.statsArray = Object.keys(this.textOccurrences.stats).map(key => {
      return { word: key, number: this.textOccurrences.stats[key] };
    });

    this.sortedStatsArray = this.statsArray.sort((a, b) => (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0));
    this.sortedStatsArray.reverse();

    this.sortedStatsArray = this.sortedStatsArray.slice(0, 10);
  }
}
