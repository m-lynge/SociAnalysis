import { Component, OnInit, AfterContentInit, OnDestroy } from '@angular/core';
import * as d3 from 'd3-selection';
import * as d3Force from 'd3-force';
import * as d3Scale from 'd3-scale';
import * as d3Array from 'd3-array';
import * as Occurences from 'Occurences';

import { NavigationService } from 'src/app/navigation.service';
import { QueryService } from 'src/app/query.service';
import { ObjectUnsubscribedError, Subscription } from 'rxjs';

@Component({
  selector: 'app-query-visual',
  templateUrl: './query-visual.component.html',
  styleUrls: ['./query-visual.component.css']
})
export class QueryVisualComponent implements OnDestroy {

  private height: number;
  private width: number;
  private svg;
  private circles: any;
  private text: any;
  private ratioScale: any;
  private max: any;
  private stopWordsActive = true;
  private subscription = new Subscription();



  // Variable used for the word freq counter:
  // tslint:disable-next-line: max-line-length
  private textOccurrencesWithStopWords: any;
  private textOccurrencesWithOutStopWords: any;
  private statsArrayWithStopWords: any;
  private sortedStatsArrayWithStopWords;
  private sortedStatsArrayWithOutStopWords;
  private simulation;
  private statsArrayWithOutStopWords;
  private chartDiv: any;
  private stopwords = ['ad', 'af', 'aldrig', 'alle', 'alt', 'anden', 'andet',
    'andre', 'at', 'bare', 'begge', 'blev', 'blive', 'bliver', 'da', 'de', 'dem',
    'den', 'denne', 'der', 'deres', 'det', 'dette', 'dig', 'din', 'dine', 'disse',
    'dit', 'dog', 'du', 'efter', 'ej', 'eller', 'en', 'end', 'ene', 'eneste', 'enhver',
    'er', 'et', 'far', 'fem', 'fik', 'fire', 'flere', 'fleste', 'for', 'fordi',
    'forrige', 'fra', 'få', 'får', 'før', 'god', 'godt', 'ham', 'han', 'hans', 'har',
    'havde', 'have', 'hej', 'helt', 'hende', 'hendes', 'her', 'hos', 'hun', 'hvad',
    'hvem', 'hver', 'hvilken', 'hvis', 'hvor', 'hvordan', 'hvorfor', 'hvornår', 'i',
    'ikke', 'ind', 'ingen', 'intet', 'ja', 'jeg', 'jer', 'jeres', 'jo', 'kan', 'kom',
    'komme', 'kommer', 'kun', 'kunne', 'lad', 'lav', 'lidt', 'lige', 'lille', 'man',
    'mand', 'mange', 'med', 'meget', 'men', 'mens', 'mere', 'mig', 'min', 'mine', 'mit',
    'mod', 'må', 'ned', 'nej', 'ni', 'nogen', 'noget', 'nogle', 'nu', 'ny', 'nyt', 'når',
    'nær', 'næste', 'næsten', 'og', 'også', 'okay', 'om', 'op', 'os', 'otte', 'over', 'på',
    'se', 'seks', 'selv', 'ser', 'ses', 'sig', 'sige', 'sin', 'sine', 'sit', 'skal', 'skulle',
    'som', 'stor', 'store', 'syv', 'så', 'sådan', 'tag', 'tage', 'thi', 'ti', 'til', 'to', 'tre',
    'ud', 'under', 'var', 'ved', 'vi', 'vil', 'ville', 'vor', 'vores', 'være', 'været', 'alene',
    'allerede', 'alligevel', 'altid', 'bag', 'blandt', 'burde', 'bør', 'dens', 'derefter', 'derfor',
    'derfra', 'deri', 'dermed', 'derpå', 'derved', 'egen', 'ellers', 'endnu', 'ens', 'enten', 'flest',
    'foran', 'først', 'gennem', 'gjorde', 'gjort', 'gør', 'gøre', 'gørende', 'hel', 'heller', 'hen',
    'henover', 'herefter', 'heri', 'hermed', 'herpå', 'hvilke', 'hvilkes', 'hvorefter', 'hvorfra',
    'hvorhen', 'hvori', 'hvorimod', 'hvorved', 'igen', 'igennem', 'imellem', 'imens', 'imod', 'indtil',
    'langs', 'lave', 'lavet', 'ligesom', 'længere', 'mellem', 'mest', 'mindre', 'mindst', 'måske', 'nemlig',
    'nogensinde', 'nok', 'omkring', 'overalt', 'samme', 'sammen', 'selvom', 'senere', 'siden', 'stadig',
    'synes', 'syntes', 'således', 'temmelig', 'tidligere', 'tilbage', 'tit', 'uden', 'udover',
    'undtagen', 'via', 'vore', 'vær', 'øvrigt', 'a', 'about', 'above', 'above', 'across', 'after',
    'afterwards', 'again', 'against', 'all', 'almost', 'alone', 'along', 'already', 'also', 'although',
    'always', 'am', 'among', 'amongst', 'amoungst', 'amount', 'an', 'and', 'another', 'any', 'anyhow',
    'anyone', 'anything', 'anyway', 'anywhere', 'are', 'around', 'as', 'at', 'back', 'be', 'became', 'because',
    'become', 'becomes', 'becoming', 'been', 'before', 'beforehand', 'behind', 'being', 'below', 'beside',
    'besides', 'between', 'beyond', 'bill', 'both', 'bottom', 'but', 'by', 'call', 'can', 'cannot', 'cant',
    'co', 'con', 'could', 'couldnt', 'cry', 'de', 'describe', 'detail', 'do', 'done', 'down', 'due', 'during',
    'each', 'eg', 'eight', 'either', 'eleven', 'else', 'elsewhere', 'empty', 'enough', 'etc', 'even', 'ever',
    'every', 'everyone', 'everything', 'everywhere', 'except', 'few', 'fifteen', 'fify', 'fill', 'find',
    'fire', 'first', 'five', 'for', 'former', 'formerly', 'forty', 'found', 'four', 'from', 'front', 'full',
    'further', 'get', 'give', 'go', 'had', 'has', 'hasnt', 'have', 'he', 'hence', 'her', 'here',
    'hereafter', 'hereby', 'herein', 'hereupon', 'hers', 'herself', 'him', 'himself', 'his', 'how',
    'however', 'hundred', 'ie', 'if', 'in', 'inc', 'indeed', 'interest', 'into', 'is', 'it', 'its',
    'itself', 'keep', 'last', 'latter', 'latterly', 'least', 'less', 'ltd', 'made', 'many', 'may', 'me', 'meanwhile', 'might', 'mill', 'mine', 'more', 'moreover', 'most', 'mostly', 'move', 'much', 'must', 'my', 'myself', 'name', 'namely', 'neither', 'never', 'nevertheless', 'next', 'nine', 'no', 'nobody', 'none', 'noone', 'nor', 'not', 'nothing', 'now', 'nowhere', 'of', 'off', 'often', 'on', 'once', 'one', 'only', 'onto', 'or', 'other', 'others', 'otherwise', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'part', 'per', 'perhaps', 'please', 'put', 'rather', 're', 'same', 'see', 'seem', 'seemed', 'seeming', 'seems', 'serious', 'several', 'she', 'should', 'show', 'side', 'since', 'sincere', 'six', 'sixty', 'so', 'some', 'somehow', 'someone', 'something', 'sometime', 'sometimes', 'somewhere', 'still', 'such', 'system', 'take', 'ten', 'than', 'that', 'the', 'their', 'them', 'themselves', 'then', 'thence', 'there', 'thereafter', 'thereby', 'therefore', 'therein', 'thereupon', 'these', 'they', 'thickv', 'thin', 'third', 'this', 'those', 'though', 'three', 'through', 'throughout', 'thru', 'thus', 'to', 'together', 'too', 'top', 'toward', 'towards', 'twelve', 'twenty', 'two', 'un', 'under', 'until', 'up', 'upon', 'us', 'very', 'via', 'was', 'we', 'well', 'were', 'what', 'whatever', 'when', 'whence', 'whenever', 'where', 'whereafter', 'whereas', 'whereby', 'wherein', 'whereupon', 'wherever', 'whether', 'which', 'while', 'whither', 'who', 'whoever', 'whole', 'whom', 'whose', 'why', 'will', 'with', 'within', 'without', 'would', 'yet', 'you', 'your', 'yours', 'yourself', 'yourselves', 'the'];

  private dataforCircles: any;
  constructor(private navigationservice: NavigationService, private queryservice: QueryService) {

    this.navigationservice.setNavi = true;
    // this.height = 500;
    // this.width = 500;
    this.subscription = this.queryservice.allPostsTextSubject.subscribe((text) => {
      if (this.svg) {
        this.svg.selectAll('*').remove();
      }
      if (text) {
        this.countWords(text);
        this.Init();
        this.DrawCirles();
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private Init() {
    // this.svg = d3.select('svg')
    //   .attr('height', this.height)
    //   .attr('width', this.width)
    //   .style('text-anchor', 'middle')
    //   .append('g')
    //   .attr('transform', 'translate(250,250)');

    this.svg = d3.select('svg')
      .classed("svg-container", true)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 600 400")
      .classed("svg-content-responsive", true)
      .style('text-anchor', 'middle')
      .append('g')
      .style('transform', 'translate(50%,50%)');


    this.svg.on('click', () => {
      this.svg.selectAll('*').remove();
      this.stopWordsActive = !this.stopWordsActive;
      this.DrawCirles();
    });
    // mapping the domain to a range for calculating the correct radius for the circles
  }

  private DrawCirles() {
    if (this.stopWordsActive) {
      this.dataforCircles = this.sortedStatsArrayWithStopWords;
      this.max = this.sortedStatsArrayWithStopWords[0].number;
    } else {
      this.dataforCircles = this.sortedStatsArrayWithOutStopWords;
      this.max = this.sortedStatsArrayWithOutStopWords[0].number;
    }
    this.ratioScale = d3Scale
      .scaleSqrt()
      .domain([1, this.max])
      .range([20, 70]);

    this.circles = this.svg.selectAll('.words')
      .data(this.dataforCircles)
      .enter()
      .append('circle')
      .attr('class', 'words')
      .attr('r', (d) => this.ratioScale(d.number))
      .attr('fill', (d) => d = 'hsl(' + Math.random() * 360 + ',50%,50%)');
    this.text = this.svg.selectAll('.text')
      .data(this.dataforCircles)
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
      .nodes(this.dataforCircles)
      .on('tick', () => this.ticked());
  }

  private countWords(text: string) {
    this.textOccurrencesWithStopWords = new Occurences(text, { ignored: this.stopwords });
    this.textOccurrencesWithOutStopWords = new Occurences(text);

    this.statsArrayWithStopWords = Object.keys(this.textOccurrencesWithStopWords.stats).map(key => {
      return { word: key, number: this.textOccurrencesWithStopWords.stats[key] };
    });

    this.statsArrayWithOutStopWords = Object.keys(this.textOccurrencesWithOutStopWords.stats).map(key => {
      return { word: key, number: this.textOccurrencesWithOutStopWords.stats[key] };
    });
    this.sortedStatsArrayWithStopWords = this.statsArrayWithStopWords.sort(
      (a, b) => (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0));
    this.sortedStatsArrayWithStopWords = this.sortedStatsArrayWithStopWords.slice(
      this.sortedStatsArrayWithStopWords.length - 11, this.sortedStatsArrayWithStopWords.length - 1);
    this.sortedStatsArrayWithStopWords.reverse();

    this.sortedStatsArrayWithOutStopWords = this.statsArrayWithOutStopWords.sort(
      (a, b) => (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0));
    this.sortedStatsArrayWithOutStopWords = this.sortedStatsArrayWithOutStopWords.slice(
      this.sortedStatsArrayWithOutStopWords.length - 11, this.sortedStatsArrayWithOutStopWords.length - 1);
    this.sortedStatsArrayWithOutStopWords.reverse();
  }
}
