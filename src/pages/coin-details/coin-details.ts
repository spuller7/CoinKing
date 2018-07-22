    import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { DataProvider } from '../../providers/data/data';
import * as $ from 'jquery';
import { BuySellPage} from '../buy-sell/buy-sell';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the CoinDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coin-details',
  templateUrl: 'coin-details.html',
})
export class CoinDetailsPage {

  details: Object;
  coinData: any;
  transactionHistory: Object = [];
  coin: CharacterData;
  selected : string;
  currentChart : any;
  coinName: Object;
  isStartup: boolean;
  startingPrice;
  ccID = 0;
  holdings = 0;
  fixedAmount = 2;
  descriptionButtonText = "READ MORE";

  constructor(public loading: LoadingController, public navCtrl: NavController, public navParams: NavParams, private _data: DataProvider, private _transactions: DatabaseProvider) {
    this.ccID = navParams.get('ccID');
    this.coin = navParams.get('coin');
    this.holdings = navParams.get('holdings');
    this.coinName = navParams.get('name');
    this.isStartup = true;
  }

  ionViewWillEnter() {
    this.transactionHistory = [];
    this.loadCoin();
    this.getCoinHoldings();
  }

  getCoinHoldings() {
      let holdingAmount = this._transactions.getCoinHolding(this.coin);
      this.holdings = 0;
      holdingAmount.then((res) => {
        this.holdings = res['' + this.coin + ''];
      });
  }

  loadCoin() {
    var coinThis = this;
    let loader = this.loading.create({
      content: 'Loading..',
      spinner: 'crescent'
    });

    loader.present().then(() => {
      this._data.getCoin(this.coin).subscribe(res => {
          this.coinData = res['RAW']['' + this.coin + '']['USD'];
          this.coinData['chartDescriptor'];
          this.coinData['change'];
          this.coinData['percentChange'];
          this._data.getCoinDescription(this.ccID).subscribe(res => {
            this.coinData['description'] =  res['Data']['General']['Description'];
            $("#description-content").html(this.coinData['description']);
          });
          this.selected = this._data.getSelectedTimeRange();
          if(this.isStartup == true)
          {
            this.numberAnimation();
            this.isStartup = false;
          }
          var dataRange;
          $("button").removeClass("selected");
          if(this.selected == "hour")
          {
            this.coinData.chartDescriptor = "past hour";
            $(".oneHour").addClass("selected");
            dataRange = this._data.getChartHour(this.coin);
          }
          else if(this.selected == "week")
          {
            this.coinData.chartDescriptor = "past week";
            $(".oneWeek").addClass("selected");
            dataRange = this._data.getChartWeek(this.coin);
          }
           else if(this.selected == "month")
          {
            this.coinData.chartDescriptor = "past 30 days";
            $(".oneMonth").addClass("selected");
            dataRange = this._data.getChartMonth(this.coin);
          }
           else if(this.selected == "three months")
          {
            this.coinData.chartDescriptor = "past 3 months";
            $(".threeMonths").addClass("selected");
            dataRange = this._data.getChartThreeMonths(this.coin);
          }
           else if(this.selected == "year")
          {
            this.coinData.chartDescriptor = "past year";
            $(".oneYear").addClass("selected");
            dataRange = this._data.getChartOneYear(this.coin);
          }
          else if(this.selected == "five years")
          {
            this.coinData.chartDescriptor = "past 5 years";
            $(".fiveYears").addClass("selected");
            dataRange = this._data.getChartFiveYears(this.coin);
          }
          else  
          {
            this.coinData.change = this.coinData.CHANGE24HOUR;
            this.coinData.percentChange = this.coinData.CHANGEPCT24HOUR;
            this.coinData.chartDescriptor = "past 24 hours";
            $(".oneDay").addClass("selected");  
            dataRange = this._data.getChart(this.coin);
          }
          this.getTransactionHistory();
          dataRange
            .subscribe(res => {
            console.log(res);
              loader.dismiss();
              let coinHistory = res['Data'].map((a) => (a.close));

              if(this.selected != "oneDay")
              {
                var min = coinHistory[0];
                if(!min)
                {
                  min = 0;
                }
                var max = coinHistory[coinHistory.length - 1];
                this.coinData.change = max - min;
                this.coinData.percentChange = (this.coinData.change / min) * 100;
              }

              var active = false;
              setTimeout(() => {

                let chartColor = "";
                if(this.coinData.change < 0)
                {
                  chartColor = $("#red").css('background-color');
                }
                else
                {
                  chartColor = $("#green").css('background-color');
                }

                Chart.defaults.LineWithLine = Chart.defaults.line;
                
                Chart.controllers.LineWithLine = Chart.controllers.line.extend({
                  draw: function (ease) {
                    Chart.controllers.line.prototype.draw.call(this, ease);
                    if(!this.chart.tooltip._active || this.chart.tooltip._active.length == 0)
                    {
                        if(active)
                        {
                          coinThis.setCurrentPrice();
                          active = false;
                        }
                    }

                    if (this.chart.tooltip._active && this.chart.tooltip._active.length)
                    {
                      if(!active) {active = true;}
                      var activePoint = this.chart.tooltip._active[0],
                        ctx = this.chart.ctx,
                        x = activePoint.tooltipPosition().x,
                        topY = this.chart.scales['y-axis-0'].top,
                        bottomY = this.chart.scales['y-axis-0'].bottom;

                      // draw line
                      ctx.save();
                      ctx.beginPath();
                      ctx.moveTo(x, topY);
                      ctx.lineTo(x, bottomY);
                      ctx.lineWidth = 2;
                      ctx.strokeStyle = '#E3E3E3';
                      ctx.stroke();
                      ctx.restore();
                    }
                  }
                });
                 
                this.currentChart = new Chart($("#ctx"), {
                  type: 'LineWithLine',
                  data: {
                    labels: coinHistory,
                    datasets: [{
                      data: coinHistory,
                      borderColor: chartColor,
                      backgroundColor : "#383838",
                      fill: false 
                    }]
                  },
                  options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    events: ["mousemove", "mouseout", "click", "touchstart", "touchmove", "touchend"],
                    elements: {
                      point: {
                        radius: 0
                      }
                    },
                    tooltips: {
                      intersect: false,
                      mode: 'index',
                      backgroundColor : "rgba(0,0,0,0.0)",
                      titleFontColor : "rgba(0,0,0,0.0)",
                      callbacks: {
                        label: function (tooltipItems, data) {
                          coinThis.numberAnimationOnHover(tooltipItems.yLabel);
                          coinThis.startingPrice = tooltipItems.yLabel;
                        }
                      },
                    },
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: false
                      }],
                      yAxes: [{
                        display: false,
                      }],
                    }
                  }
                });
              }, 250);

            });
        });

    })
  }

  setCurrentPrice()
  {
    var actualPrice = this.coinData['PRICE'];
    var localThis = this;
      $("#coinPrice").prop('Counter',this.startingPrice).animate({
        Counter: actualPrice
      }, {
          duration: 200,
          easing: 'swing',
          step: function (now) {
            var numb = parseFloat(this.Counter);
            $("#coinPrice").text('$' + numb.toFixed(localThis.fixedAmount).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
          }
      });
  }

  getTransactionHistory()
  {
    this._transactions.readTransactionTable(this.coin).then((res) => {
      this.transactionHistory = res;
    });
  }

  numberAnimation() {
    
    var actualPrice = this.coinData['PRICE'];
    if(actualPrice < 10)
    {
      this.fixedAmount = 5;
    }
    var localThis = this;

    $({countNum: $("#coinPrice").text()}).animate({
        countNum: actualPrice
      },{
        duration: 2000,
        //easing: 'linear',
        step: function () {
          // What todo on every count
          var numb = parseFloat(this.countNum);
          $("#coinPrice").text('$' + numb.toFixed(localThis.fixedAmount).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        },
      });
  }

  tradeCoin(transaction_type)
  {
    this.navCtrl.push(BuySellPage, {
      coin: this.coin,
      name: this.coinName,
      holdings : this.holdings,
      currentPrice: this.coinData['PRICE'],
      type: transaction_type
    });

    this.clearGraph();
  }

  numberAnimationOnHover(numberHover)
  {
    if(!isNaN(numberHover))
    {
      $("#coinPrice").text('$' + numberHover.toFixed(this.fixedAmount).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
    }
  }

  onReadMore()
  {
    if(this.descriptionButtonText == "READ MORE")
    {
      $('#description-content').removeClass('collapsed');
      this.descriptionButtonText = "READ LESS";
      $('.fade').css('display', 'none');
    }
    else
    {
      $('#description-content').addClass('collapsed');
      this.descriptionButtonText = "READ MORE";
      $('.fade').css('display', 'inline-block');
    }
    
  }

  onOneHour()
  {
    $("button").removeClass("selected");
    $(".oneHour").addClass("selected");
    this.currentChart.destroy();
    this._data.setSelectedTimeRange("hour");
    this.ionViewWillEnter();
  }

  onOneDay()
  {
    $("button").removeClass("selected");
    $(".oneDay").addClass("selected");
    this.currentChart.destroy();
    this._data.setSelectedTimeRange("day");
    this.ionViewWillEnter();
  }

  onOneWeek()
  {
    $("button").removeClass("selected");
    $(".oneWeek").addClass("selected");
    this.currentChart.destroy();
    this._data.setSelectedTimeRange("week");
    this.ionViewWillEnter();
  }

  onOneMonth()
  {
    $("button").removeClass("selected");
    $(".oneMonth").addClass("selected");
    this.currentChart.destroy();
    this._data.setSelectedTimeRange("month");
    this.ionViewWillEnter();
    }

  onThreeMonths()
  {
    $("button").removeClass("selected");
    $(".threeMonths").addClass("selected");
    this.currentChart.destroy();
    this._data.setSelectedTimeRange("three months");
    this.ionViewWillEnter();
  }

  onOneYear()
  {
    $("button").removeClass("selected");
    $(".oneYear").addClass("selected");
    this.currentChart.destroy();
    this._data.setSelectedTimeRange("year");
    this.ionViewWillEnter();
  }

  onFiveYears()
  {
    $("button").removeClass("selected");
    $(".fiveYears").addClass("selected");
    this.currentChart.destroy();
    this._data.setSelectedTimeRange("five years");
    this.ionViewWillEnter();
  }

  clearGraph()
  {
    this.currentChart.destroy();
  }
}
