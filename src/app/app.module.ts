import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MarketCapPage } from '../pages/market-cap/market-cap';
import { WatchlistConfigurationPage } from '../pages/watchlist-configuration/watchlist-configuration';
import { CoinDetailsPage } from '../pages/coin-details/coin-details';
import { DataProvider } from '../providers/data/data';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { AddCoinPage } from '../pages/add-coin/add-coin';
import { ListOptionsComponent } from '../components/list-options/list-options';
import { BuySellPage} from '../pages/buy-sell/buy-sell';
import { OnboardingPage} from '../pages/onboarding/onboarding';
import { DatabaseProvider } from '../providers/database/database';
import { SQLite  , SQLiteDatabaseConfig } from '@ionic-native/sqlite';
import { ListProvider } from '../providers/list/list';
import { Clipboard } from '@ionic-native/clipboard';
import { Network }  from '@ionic-native/network';

import { HistoryPage } from '../pages/history/history';
import { SettingsPage } from '../pages/settings/settings';
import { DonatePage } from '../pages/donate/donate';

//SQL file is loaded via script tag in index.html --> <script src="assets/sql/sql.js"></script>
declare var SQL;

export class SQLiteObject{
    _objectInstance: any;

    constructor(_objectInstance: any){
      this._objectInstance = _objectInstance;
    };

    executeSql(statement: string, params: any): Promise<any>{

      return new Promise((resolve,reject)=>{
        try {
          console.log(statement)
          var st = this._objectInstance.prepare(statement,params);
          var rows :Array<any> = [] ;
          while(st.step()) {
            var row = st.getAsObject();
            rows.push(row);
          }
          var payload = {
            rows: {
              item: function(i) {
                return rows[i];
              },
              length: rows.length
            },
            rowsAffected: this._objectInstance.getRowsModified() || 0,
            insertId: this._objectInstance.insertId || void 0
          };
          //save database after each sql query
          var arr : ArrayBuffer = this._objectInstance.export();
          localStorage.setItem("database",String(arr));
          resolve(payload);
        } catch(e){
          reject(e);
        }
      });
    };

    sqlBatch(statements: string[], params: any): Promise<any>{
      return new Promise((resolve,reject)=>{
        try {
          var rows :Array<any> = [];
          for (let statement of statements) {
            console.log(statement);
            var st = this._objectInstance.prepare(statement,params);
            while(st.step()) {
                var row = st.getAsObject();
                rows.push(row);
            }
          }
          var payload = {
            rows: {
              item: function(i) {
                return rows[i];
              },
              length: rows.length
            },
            rowsAffected: this._objectInstance.getRowsModified(),
            insertId: this._objectInstance.insertId || void 0
          };
          //save database after each sql query
          var arr : ArrayBuffer = this._objectInstance.export();
          localStorage.setItem("database",String(arr));
          resolve(payload);
        } catch(e){
          reject(e);
        }
      });
    };
}

/*
  Implemented using edited code from actual cordova plugin
*/
export class SQLitePorterMock {
    /**
     * Trims leading and trailing whitespace from a string
     * @param {string} str - untrimmed string
     * @returns {string} trimmed string
     */


    trimWhitespace(str){
      return str.replace(/^\s+/,"").replace(/\s+$/,"");
    }

    importSqlToDb(db, sql, opts = {}){
      try {
        const statementRegEx = /(?!\s|;|$)(?:[^;"']*(?:"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*')?)*/g;
        var statements = sql
          .replace(/(?:\/\*(?:[\s\S]*?)\*\/)|(?:([\s;])+\/\/(?:.*)$)/gm,"") // strip out comments
          .match(statementRegEx);

        if(statements === null || (Array.isArray && !Array.isArray(statements))) statements = [];

        // Strip empty statements
        for(var i = 0; i < statements.length; i++){
          if(!statements[i]){
              delete statements[i];
          }
        }
        return db.sqlBatch(statements)
      } catch(e) {
        console.error(e.message);
      }
    }
}

export class SQLiteMock {

  public create(config: SQLiteDatabaseConfig): Promise<SQLiteObject> {
    var db;
    var storeddb = localStorage.getItem("database");

    if(storeddb) {
      var arr = storeddb.split(',');
      db = new SQL.Database(arr);
    }
    else {
       db = new SQL.Database();
    }

    return new Promise((resolve,reject)=>{
      resolve(new SQLiteObject(db));
    });
  }
}

export const firebaseConfig = {
  apiKey: '1:216402926681:android:8877626d2310fbde',
  authDomain: '',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: ''
};

@NgModule({
  declarations: [
    MyApp,
	  HomePage,
    MarketCapPage,
    HistoryPage,
    SettingsPage,
    DonatePage,
    WatchlistConfigurationPage,
    CoinDetailsPage,
    AddCoinPage,
    ListOptionsComponent,
    BuySellPage,
    OnboardingPage
  ],
  imports: [
	  BrowserModule,
	  HttpClientModule,
	  IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
	  HomePage,
    HistoryPage,
    SettingsPage,
    DonatePage,
    MarketCapPage,
    WatchlistConfigurationPage,
    CoinDetailsPage,
    AddCoinPage,
    ListOptionsComponent,
    BuySellPage,
    OnboardingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    DatabaseProvider,
    DatabaseProvider,
    {provide: SQLite, useClass: SQLiteMock},
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ListProvider,
    Clipboard,
    Network
  ]
})
export class AppModule {}

