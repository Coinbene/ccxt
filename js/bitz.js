'use strict';

//  ---------------------------------------------------------------------------

const Exchange = require ('./base/Exchange');
const { ExchangeError, ArgumentsRequired, ExchangeNotAvailable, PermissionDenied, InvalidOrder, AuthenticationError, InsufficientFunds, OrderNotFound, DDoSProtection } = require ('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class bitz extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'bitz',
            'name': 'Bit-Z',
            'countries': [ 'HK' ],
            'rateLimit': 2000,
            'version': 'v2',
            'userAgent': this.userAgents['chrome'],
            'has': {
                'fetchTickers': true,
                'fetchOHLCV': true,
                'fetchOpenOrders': true,
                'fetchClosedOrders': true,
                'fetchOrders': true,
                'fetchOrder': true,
                'createMarketOrder': false,
                'fetchDeposits': true,
                'fetchWithdrawals': true,
                'fetchTransactions': false,
            },
            'timeframes': {
                '1m': '1min',
                '5m': '5min',
                '15m': '15min',
                '30m': '30min',
                '1h': '60min',
                '4h': '4hour',
                '1d': '1day',
                '5d': '5day',
                '1w': '1week',
                '1M': '1mon',
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/35862606-4f554f14-0b5d-11e8-957d-35058c504b6f.jpg',
                'api': {
                    'market': 'https://apiv2.bit-z.pro',
                    'trade': 'https://apiv2.bit-z.pro',
                    'assets': 'https://apiv2.bit-z.pro',
                },
                'www': 'https://www.bit-z.com',
                'doc': 'https://apidoc.bit-z.com/en/',
                'fees': 'https://www.bit-z.com/fee?type=1',
                'referral': 'https://u.bit-z.com/register?invite_code=1429193',
            },
            'api': {
                'market': {
                    'get': [
                        'ticker',
                        'depth',
                        'order', // trades
                        'tickerall',
                        'kline',
                        'symbolList',
                        'currencyRate',
                        'currencyCoinRate',
                        'coinRate',
                    ],
                },
                'trade': {
                    'post': [
                        'addEntrustSheet',
                        'cancelEntrustSheet',
                        'cancelAllEntrustSheet',
                        'getUserHistoryEntrustSheet', // closed orders
                        'getUserNowEntrustSheet', // open orders
                        'getEntrustSheetInfo', // order
                        'depositOrWithdraw', // transactions
                    ],
                },
                'assets': {
                    'post': [
                        'getUserAssets',
                    ],
                },
            },
            'fees': {
                'trading': {
                    'maker': 0.001,
                    'taker': 0.001,
                },
                'funding': {
                    'withdraw': {
                        'BTC': '0.5%',
                        'DKKT': '0.5%',
                        'ETH': 0.01,
                        'USDT': '0.5%',
                        'LTC': '0.5%',
                        'FCT': '0.5%',
                        'LSK': '0.5%',
                        'HXI': '0.8%',
                        'ZEC': '0.5%',
                        'DOGE': '0.5%',
                        'MZC': '0.5%',
                        'ETC': '0.5%',
                        'GXS': '0.5%',
                        'XPM': '0.5%',
                        'PPC': '0.5%',
                        'BLK': '0.5%',
                        'XAS': '0.5%',
                        'HSR': '0.5%',
                        'NULS': 5.0,
                        'VOISE': 350.0,
                        'PAY': 1.5,
                        'EOS': 0.6,
                        'YBCT': 35.0,
                        'OMG': 0.3,
                        'OTN': 0.4,
                        'BTX': '0.5%',
                        'QTUM': '0.5%',
                        'DASH': '0.5%',
                        'GAME': '0.5%',
                        'BCH': '0.5%',
                        'GNT': 9.0,
                        'SSS': 1500.0,
                        'ARK': '0.5%',
                        'PART': '0.5%',
                        'LEO': '0.5%',
                        'DGB': '0.5%',
                        'ZSC': 130.0,
                        'VIU': 350.0,
                        'BTG': '0.5%',
                        'ARN': 10.0,
                        'VTC': '0.5%',
                        'BCD': '0.5%',
                        'TRX': 200.0,
                        'HWC': '0.5%',
                        'UNIT': '0.5%',
                        'OXY': '0.5%',
                        'MCO': 0.3500,
                        'SBTC': '0.5%',
                        'BCX': '0.5%',
                        'ETF': '0.5%',
                        'PYLNT': 0.4000,
                        'XRB': '0.5%',
                        'ETP': '0.5%',
                    },
                },
            },
            'precision': {
                'amount': 8,
                'price': 8,
            },
            'options': {
                'fetchOHLCVVolume': true,
                'fetchOHLCVWarning': true,
                'lastNonceTimestamp': 0,
            },
            'commonCurrencies': {
                // https://github.com/ccxt/ccxt/issues/3881
                // https://support.bit-z.pro/hc/en-us/articles/360007500654-BOX-BOX-Token-
                'BOX': 'BOX Token',
                'XRB': 'NANO',
                'PXC': 'Pixiecoin',
            },
            'exceptions': {
                // '200': Success
                '-102': ExchangeError, // Invalid parameter
                '-103': AuthenticationError, // Verification failed
                '-104': ExchangeNotAvailable, // Network Error-1
                '-105': AuthenticationError, // Invalid api signature
                '-106': ExchangeNotAvailable, // Network Error-2
                '-109': AuthenticationError, // Invalid scretKey
                '-110': DDoSProtection, // The number of access requests exceeded
                '-111': PermissionDenied, // Current IP is not in the range of trusted IP
                '-112': ExchangeNotAvailable, // Service is under maintenance
                '-100015': AuthenticationError, // Trade password error
                '-100044': ExchangeError, // Fail to request data
                '-100101': ExchangeError, // Invalid symbol
                '-100201': ExchangeError, // Invalid symbol
                '-100301': ExchangeError, // Invalid symbol
                '-100401': ExchangeError, // Invalid symbol
                '-100302': ExchangeError, // Type of K-line error
                '-100303': ExchangeError, // Size of K-line error
                '-200003': AuthenticationError, // Please set trade password
                '-200005': PermissionDenied, // This account can not trade
                '-200025': ExchangeNotAvailable, // Temporary trading halt
                '-200027': InvalidOrder, // Price Error
                '-200028': InvalidOrder, // Amount must be greater than 0
                '-200029': InvalidOrder, // Number must be between %s and %d
                '-200030': InvalidOrder, // Over price range
                '-200031': InsufficientFunds, // Insufficient assets
                '-200032': ExchangeError, // System error. Please contact customer service
                '-200033': ExchangeError, // Fail to trade
                '-200034': OrderNotFound, // The order does not exist
                '-200035': OrderNotFound, // Cancellation error, order filled
                '-200037': InvalidOrder, // Trade direction error
                '-200038': ExchangeError, // Trading Market Error
                '-200055': OrderNotFound, // Order record does not exist
                '-300069': AuthenticationError, // api_key is illegal
                '-300101': ExchangeError, // Transaction type error
                '-300102': InvalidOrder, // Price or number cannot be less than 0
                '-300103': AuthenticationError, // Trade password error
                '-301001': ExchangeNotAvailable, // Network Error-3
            },
        });
    }

    async fetchMarkets (params = {}) {
        const response = await this.marketGetSymbolList (params);
        //
        //     {    status:    200,
        //             msg:   "",
        //            data: {   ltc_btc: {          id: "1",
        //                                        name: "ltc_btc",
        //                                    coinFrom: "ltc",
        //                                      coinTo: "btc",
        //                                 numberFloat: "4",
        //                                  priceFloat: "8",
        //                                      status: "1",
        //                                    minTrade: "0.010",
        //                                    maxTrade: "500000000.000" },
        //                    qtum_usdt: {          id: "196",
        //                                        name: "qtum_usdt",
        //                                    coinFrom: "qtum",
        //                                      coinTo: "usdt",
        //                                 numberFloat: "4",
        //                                  priceFloat: "2",
        //                                      status: "1",
        //                                    minTrade: "0.100",
        //                                    maxTrade: "500000000.000" },  },
        //            time:    1535969146,
        //       microtime:   "0.66955600 1535969146",
        //          source:   "api"                                           }
        //
        const markets = this.safeValue (response, 'data');
        const ids = Object.keys (markets);
        const result = [];
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const market = markets[id];
            const numericId = this.safeString (market, 'id');
            const baseId = this.safeString (market, 'coinFrom');
            const quoteId = this.safeString (market, 'coinTo');
            let base = baseId.toUpperCase ();
            let quote = quoteId.toUpperCase ();
            base = this.safeCurrencyCode (base);
            quote = this.safeCurrencyCode (quote);
            const symbol = base + '/' + quote;
            const precision = {
                'amount': this.safeInteger (market, 'numberFloat'),
                'price': this.safeInteger (market, 'priceFloat'),
            };
            result.push ({
                'info': market,
                'id': id,
                'numericId': numericId,
                'symbol': symbol,
                'base': base,
                'quote': quote,
                'baseId': baseId,
                'quoteId': quoteId,
                'active': true,
                'precision': precision,
                'limits': {
                    'amount': {
                        'min': this.safeFloat (market, 'minTrade'),
                        'max': this.safeFloat (market, 'maxTrade'),
                    },
                    'price': {
                        'min': Math.pow (10, -precision['price']),
                        'max': undefined,
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
            });
        }
        return result;
    }

    async fetchBalance (params = {}) {
        await this.loadMarkets ();
        const response = await this.assetsPostGetUserAssets (params);
        //
        //     {
        //         status: 200,
        //         msg: "",
        //         data: {
        //             cny: 0,
        //             usd: 0,
        //             btc_total: 0,
        //             info: [{
        //                 "name": "zpr",
        //                 "num": "37.49067275",
        //                 "over": "37.49067275",
        //                 "lock": "0.00000000",
        //                 "btc": "0.00000000",
        //                 "usd": "0.00000000",
        //                 "cny": "0.00000000",
        //             }],
        //         },
        //         time: 1535983966,
        //         microtime: "0.70400500 1535983966",
        //         source: "api",
        //     }
        //
        const balances = this.safeValue (response['data'], 'info');
        const result = { 'info': response };
        for (let i = 0; i < balances.length; i++) {
            const balance = balances[i];
            const currencyId = this.safeString (balance, 'name');
            const code = this.safeCurrencyCode (currencyId);
            const account = this.account ();
            account['used'] = this.safeFloat (balance, 'lock');
            account['total'] = this.safeFloat (balance, 'num');
            account['free'] = this.safeFloat (balance, 'over');
            result[code] = account;
        }
        return this.parseBalance (result);
    }

    parseTicker (ticker, market = undefined) {
        //
        //      {          symbol: "eth_btc",
        //            quoteVolume: "3905.72",
        //                 volume: "97058.21",
        //            priceChange: "-1.72",
        //         priceChange24h: "-1.65",
        //               askPrice: "0.03971272",
        //                 askQty: "0.0663",
        //               bidPrice: "0.03961469",
        //                 bidQty: "19.5451",
        //                   open: "0.04036769",
        //                   high: "0.04062988",
        //                    low: "0.03956123",
        //                    now: "0.03970100",
        //                firstId:  115567767,
        //                 lastId:  115795316,
        //              dealCount:  14078,
        //        numberPrecision:  4,
        //         pricePrecision:  8,
        //                    cny: "1959.05",
        //                    usd: "287.10",
        //                    krw: "318655.82"   }
        //
        const timestamp = undefined;
        let symbol = undefined;
        if (market === undefined) {
            const marketId = this.safeString (ticker, 'symbol');
            market = this.safeValue (this.markets_by_id, marketId);
        }
        if (market !== undefined) {
            symbol = market['symbol'];
        }
        const last = this.safeFloat (ticker, 'now');
        const open = this.safeFloat (ticker, 'open');
        let change = undefined;
        let average = undefined;
        if (last !== undefined && open !== undefined) {
            change = last - open;
            average = this.sum (last, open) / 2;
        }
        return {
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeFloat (ticker, 'high'),
            'low': this.safeFloat (ticker, 'low'),
            'bid': this.safeFloat (ticker, 'bidPrice'),
            'bidVolume': this.safeFloat (ticker, 'bidQty'),
            'ask': this.safeFloat (ticker, 'askPrice'),
            'askVolume': this.safeFloat (ticker, 'askQty'),
            'vwap': undefined,
            'open': open,
            'close': last,
            'last': last,
            'previousClose': undefined,
            'change': change,
            'percentage': this.safeFloat (ticker, 'priceChange24h'),
            'average': average,
            'baseVolume': this.safeFloat (ticker, 'volume'),
            'quoteVolume': this.safeFloat (ticker, 'quoteVolume'),
            'info': ticker,
        };
    }

    parseMicrotime (microtime) {
        if (microtime === undefined) {
            return microtime;
        }
        const parts = microtime.split (' ');
        const milliseconds = parseFloat (parts[0]);
        const seconds = parseInt (parts[1]);
        const total = this.sum (seconds, milliseconds);
        return parseInt (total * 1000);
    }

    async fetchTicker (symbol, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.marketGetTicker (this.extend (request, params));
        //
        //     {    status:    200,
        //             msg:   "",
        //            data: {          symbol: "eth_btc",
        //                        quoteVolume: "3905.72",
        //                             volume: "97058.21",
        //                        priceChange: "-1.72",
        //                     priceChange24h: "-1.65",
        //                           askPrice: "0.03971272",
        //                             askQty: "0.0663",
        //                           bidPrice: "0.03961469",
        //                             bidQty: "19.5451",
        //                               open: "0.04036769",
        //                               high: "0.04062988",
        //                                low: "0.03956123",
        //                                now: "0.03970100",
        //                            firstId:  115567767,
        //                             lastId:  115795316,
        //                          dealCount:  14078,
        //                    numberPrecision:  4,
        //                     pricePrecision:  8,
        //                                cny: "1959.05",
        //                                usd: "287.10",
        //                                krw: "318655.82"   },
        //            time:    1535970397,
        //       microtime:   "0.76341900 1535970397",
        //          source:   "api"                             }
        //
        const ticker = this.parseTicker (response['data'], market);
        const timestamp = this.parseMicrotime (this.safeString (response, 'microtime'));
        return this.extend (ticker, {
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
        });
    }

    async fetchTickers (symbols = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {};
        if (symbols !== undefined) {
            const ids = this.marketIds (symbols);
            request['symbols'] = ids.join (',');
        }
        const response = await this.marketGetTickerall (this.extend (request, params));
        //
        //     {    status:    200,
        //             msg:   "",
        //            data: {   ela_btc: {          symbol: "ela_btc",
        //                                     quoteVolume: "0.00",
        //                                          volume: "3.28",
        //                                     priceChange: "0.00",
        //                                  priceChange24h: "0.00",
        //                                        askPrice: "0.00147984",
        //                                          askQty: "5.4580",
        //                                        bidPrice: "0.00120230",
        //                                          bidQty: "12.5384",
        //                                            open: "0.00149078",
        //                                            high: "0.00149078",
        //                                             low: "0.00149078",
        //                                             now: "0.00149078",
        //                                         firstId:  115581219,
        //                                          lastId:  115581219,
        //                                       dealCount:  1,
        //                                 numberPrecision:  4,
        //                                  pricePrecision:  8,
        //                                             cny: "73.66",
        //                                             usd: "10.79",
        //                                             krw: "11995.03"    }     },
        //            time:    1535971578,
        //       microtime:   "0.39854200 1535971578",
        //          source:   "api"                                                }
        //
        const tickers = this.safeValue (response, 'data');
        const timestamp = this.parseMicrotime (this.safeString (response, 'microtime'));
        const result = {};
        const ids = Object.keys (tickers);
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            let ticker = tickers[id];
            let market = undefined;
            if (id in this.markets_by_id) {
                market = this.markets_by_id[id];
            }
            ticker = this.parseTicker (tickers[id], market);
            let symbol = ticker['symbol'];
            if (symbol === undefined) {
                if (market !== undefined) {
                    symbol = market['symbol'];
                } else {
                    const [ baseId, quoteId ] = id.split ('_');
                    const base = this.safeCurrencyCode (baseId);
                    const quote = this.safeCurrencyCode (quoteId);
                    symbol = base + '/' + quote;
                }
            }
            if (symbol !== undefined) {
                result[symbol] = this.extend (ticker, {
                    'timestamp': timestamp,
                    'datetime': this.iso8601 (timestamp),
                });
            }
        }
        return result;
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'symbol': this.marketId (symbol),
        };
        const response = await this.marketGetDepth (this.extend (request, params));
        //
        //     {    status:    200,
        //             msg:   "",
        //            data: {     asks: [ ["10.00000000", "0.4426", "4.4260"],
        //                                ["1.00000000", "0.8339", "0.8339"],
        //                                ["0.91700000", "0.0500", "0.0458"],
        //                                ["0.20000000", "0.1000", "0.0200"],
        //                                ["0.03987120", "16.1262", "0.6429"],
        //                                ["0.03986120", "9.7523", "0.3887"]   ],
        //                        bids: [ ["0.03976145", "0.0359", "0.0014"],
        //                                ["0.03973401", "20.9493", "0.8323"],
        //                                ["0.03967970", "0.0328", "0.0013"],
        //                                ["0.00000002", "10000.0000", "0.0002"],
        //                                ["0.00000001", "231840.7500", "0.0023"] ],
        //                    coinPair:   "eth_btc"                                  },
        //            time:    1535974778,
        //       microtime:   "0.04017400 1535974778",
        //          source:   "api"                                                     }
        //
        const orderbook = this.safeValue (response, 'data');
        const timestamp = this.parseMicrotime (this.safeString (response, 'microtime'));
        return this.parseOrderBook (orderbook, timestamp);
    }

    parseTrade (trade, market = undefined) {
        //
        // fetchTrades (public)
        //
        //    { id:  115807453,
        //       t: "19:36:24",
        //       T:  1535974584,
        //       p: "0.03983296",
        //       n: "0.1000",
        //       s: "buy"         },
        //
        const id = this.safeString (trade, 'id');
        const timestamp = this.safeTimestamp (trade, 'T');
        let symbol = undefined;
        if (market !== undefined) {
            symbol = market['symbol'];
        }
        const price = this.safeFloat (trade, 'p');
        const amount = this.safeFloat (trade, 'n');
        let cost = undefined;
        if (price !== undefined) {
            if (amount !== undefined) {
                cost = this.priceToPrecision (symbol, amount * price);
            }
        }
        const side = this.safeString (trade, 's');
        return {
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'id': id,
            'order': undefined,
            'type': 'limit',
            'side': side,
            'takerOrMaker': undefined,
            'price': price,
            'amount': amount,
            'cost': cost,
            'fee': undefined,
            'info': trade,
        };
    }

    async fetchTrades (symbol, since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.marketGetOrder (this.extend (request, params));
        //
        //     {    status:    200,
        //             msg:   "",
        //            data: [ { id:  115807453,
        //                       t: "19:36:24",
        //                       T:  1535974584,
        //                       p: "0.03983296",
        //                       n: "0.1000",
        //                       s: "buy"         },
        //                    { id:  115806811,
        //                       t: "19:33:19",
        //                       T:  1535974399,
        //                       p: "0.03981135",
        //                       n: "9.4612",
        //                       s: "sell"        }  ],
        //            time:    1535974583,
        //       microtime:   "0.57118100 1535974583",
        //          source:   "api"                     }
        //
        return this.parseTrades (response['data'], market, since, limit);
    }

    parseOHLCV (ohlcv, market = undefined, timeframe = '1m', since = undefined, limit = undefined) {
        //
        //      {     time: "1535973420000",
        //            open: "0.03975084",
        //            high: "0.03975084",
        //             low: "0.03967700",
        //           close: "0.03967700",
        //          volume: "12.4733",
        //        datetime: "2018-09-03 19:17:00" }
        //
        return [
            this.safeInteger (ohlcv, 'time'),
            this.safeFloat (ohlcv, 'open'),
            this.safeFloat (ohlcv, 'high'),
            this.safeFloat (ohlcv, 'low'),
            this.safeFloat (ohlcv, 'close'),
            this.safeFloat (ohlcv, 'volume'),
        ];
    }

    async fetchOHLCV (symbol, timeframe = '1m', since = undefined, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const duration = this.parseTimeframe (timeframe) * 1000;
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
            'resolution': this.timeframes[timeframe],
        };
        if (limit !== undefined) {
            request['size'] = Math.min (limit, 300); // 1-300
            if (since !== undefined) {
                request['to'] = this.sum (since, limit * duration * 1000);
            }
        } else {
            if (since !== undefined) {
                throw new ExchangeError (this.id + ' fetchOHLCV requires a limit argument if the since argument is specified');
            }
        }
        const response = await this.marketGetKline (this.extend (request, params));
        //
        //     {    status:    200,
        //             msg:   "",
        //            data: {       bars: [ {     time: "1535973420000",
        //                                        open: "0.03975084",
        //                                        high: "0.03975084",
        //                                         low: "0.03967700",
        //                                       close: "0.03967700",
        //                                      volume: "12.4733",
        //                                    datetime: "2018-09-03 19:17:00" },
        //                                  {     time: "1535955480000",
        //                                        open: "0.04009900",
        //                                        high: "0.04016745",
        //                                         low: "0.04009900",
        //                                       close: "0.04012074",
        //                                      volume: "74.4803",
        //                                    datetime: "2018-09-03 14:18:00" }  ],
        //                    resolution:   "1min",
        //                        symbol:   "eth_btc",
        //                          from:   "1535973420000",
        //                            to:   "1535955480000",
        //                          size:    300                                    },
        //            time:    1535973435,
        //       microtime:   "0.56462100 1535973435",
        //          source:   "api"                                                    }
        //
        const bars = this.safeValue (response['data'], 'bars', undefined);
        if (bars === undefined) {
            return [];
        }
        return this.parseOHLCVs (bars, market, timeframe, since, limit);
    }

    parseOrderStatus (status) {
        const statuses = {
            '0': 'open',
            '1': 'open', // partially filled
            '2': 'closed', // filled
            '3': 'canceled',
        };
        return this.safeString (statuses, status, status);
    }

    parseOrder (order, market = undefined) {
        //
        // createOrder
        //
        //    {
        //         "id": "693248739",   // order id
        //         "uId": "2074056",    // uid
        //         "price": "100",      // price
        //         "number": "10",      // number
        //         "numberOver": "10",  // undealed
        //         "flag": "sale",      // flag
        //         "status": "0",       // unfilled
        //         "coinFrom": "vtc",
        //         "coinTo": "dkkt",
        //         "numberDeal": "0"    // dealed
        //     }
        //
        const id = this.safeString (order, 'id');
        let symbol = undefined;
        if (market === undefined) {
            const baseId = this.safeString (order, 'coinFrom');
            const quoteId = this.safeString (order, 'coinTo');
            if ((baseId !== undefined) && (quoteId !== undefined)) {
                const marketId = baseId + '_' + quoteId;
                if (marketId in this.markets_by_id) {
                    market = this.safeValue (this.markets_by_id, marketId);
                } else {
                    const base = this.safeCurrencyCode (baseId);
                    const quote = this.safeCurrencyCode (quoteId);
                    symbol = base + '/' + quote;
                }
            }
        }
        if (market !== undefined) {
            symbol = market['symbol'];
        }
        let side = this.safeString (order, 'flag');
        if (side !== undefined) {
            side = (side === 'sale') ? 'sell' : 'buy';
        }
        const price = this.safeFloat (order, 'price');
        const amount = this.safeFloat (order, 'number');
        const remaining = this.safeFloat (order, 'numberOver');
        const filled = this.safeFloat (order, 'numberDeal');
        let timestamp = this.safeInteger (order, 'timestamp');
        if (timestamp === undefined) {
            timestamp = this.safeTimestamp (order, 'created');
        }
        let cost = this.safeFloat (order, 'orderTotalPrice');
        if (price !== undefined) {
            if (filled !== undefined) {
                cost = filled * price;
            }
        }
        const status = this.parseOrderStatus (this.safeString (order, 'status'));
        return {
            'id': id,
            'datetime': this.iso8601 (timestamp),
            'timestamp': timestamp,
            'lastTradeTimestamp': undefined,
            'status': status,
            'symbol': symbol,
            'type': 'limit',
            'side': side,
            'price': price,
            'cost': cost,
            'amount': amount,
            'filled': filled,
            'remaining': remaining,
            'trades': undefined,
            'fee': undefined,
            'info': order,
        };
    }

    async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
        await this.loadMarkets ();
        if (type !== 'limit') {
            throw new ExchangeError (this.id + ' createOrder allows limit orders only');
        }
        const market = this.market (symbol);
        const orderType = (side === 'buy') ? '1' : '2';
        if (!this.password) {
            throw new ExchangeError (this.id + ' createOrder() requires you to set exchange.password = "YOUR_TRADING_PASSWORD" (a trade password is NOT THE SAME as your login password)');
        }
        const request = {
            'symbol': market['id'],
            'type': orderType,
            'price': this.priceToPrecision (symbol, price),
            'number': this.amountToPrecision (symbol, amount),
            'tradePwd': this.password,
        };
        const response = await this.tradePostAddEntrustSheet (this.extend (request, params));
        //
        //     {
        //         "status": 200,
        //         "msg": "",
        //         "data": {
        //             "id": "693248739",   // order id
        //             "uId": "2074056",    // uid
        //             "price": "100",      // price
        //             "number": "10",      // number
        //             "numberOver": "10",  // undealed
        //             "flag": "sale",      // flag
        //             "status": "0",       // unfilled
        //             "coinFrom": "vtc",
        //             "coinTo": "dkkt",
        //             "numberDeal": "0"    // dealed
        //         },
        //         "time": "1533035297",
        //         "microtime": "0.41892000 1533035297",
        //         "source": "api",
        //     }
        //
        const timestamp = this.parseMicrotime (this.safeString (response, 'microtime'));
        const order = this.extend ({
            'timestamp': timestamp,
        }, response['data']);
        return this.parseOrder (order, market);
    }

    async cancelOrder (id, symbol = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'entrustSheetId': id,
        };
        const response = await this.tradePostCancelEntrustSheet (this.extend (request, params));
        //
        //     {
        //         "status":200,
        //         "msg":"",
        //         "data":{
        //             "updateAssetsData":{
        //                 "coin":"bz",
        //                 "over":"1000.00000000",
        //                 "lock":"-1000.00000000"
        //             },
        //             "assetsInfo":{
        //                 "coin":"bz",
        //                 "over":"9999.99999999",
        //                 "lock":"9999.99999999"
        //             }
        //         },
        //         "time":"1535464383",
        //         "microtime":"0.91558000 1535464383",
        //         "source":"api"
        //     }
        //
        return response;
    }

    async cancelOrders (ids, symbol = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'ids': ids.join (','),
        };
        const response = await this.tradePostCancelEntrustSheet (this.extend (request, params));
        //
        //     {
        //         "status":200,
        //         "msg":"",
        //         "data":{
        //             "744173808":{
        //                 "updateAssetsData":{
        //                     "coin":"bz",
        //                     "over":"100.00000000",
        //                     "lock":"-100.00000000"
        //                 },
        //                 "assetsInfo":{
        //                     "coin":"bz",
        //                     "over":"899.99999999",
        //                     "lock":"19099.99999999"
        //                 }
        //             },
        //             "744173809":{
        //                 "updateAssetsData":{
        //                     "coin":"bz",
        //                     "over":"100.00000000",
        //                     "lock":"-100.00000000"
        //                 },
        //                 "assetsInfo":{
        //                     "coin":"bz",
        //                     "over":"999.99999999",
        //                     "lock":"18999.99999999"
        //                 }
        //             }
        //         },
        //         "time":"1535525649",
        //         "microtime":"0.05009400 1535525649",
        //         "source":"api"
        //     }
        //
        return response;
    }

    async fetchOrder (id, symbol = undefined, params = {}) {
        await this.loadMarkets ();
        const request = {
            'entrustSheetId': id,
        };
        const response = await this.tradePostGetEntrustSheetInfo (this.extend (request, params));
        //
        //     {
        //         "status":200,
        //         "msg":"",
        //         "data":{
        //             "id":"708279852",
        //             "uId":"2074056",
        //             "price":"100.00000000",
        //             "number":"10.0000",
        //             "total":"0.00000000",
        //             "numberOver":"10.0000",
        //             "numberDeal":"0.0000",
        //             "flag":"sale",
        //             "status":"0",  //0:unfilled, 1:partial deal, 2:all transactions, 3:already cancelled
        //             "coinFrom":"bz",
        //             "coinTo":"usdt",
        //             "orderTotalPrice":"0",
        //             "created":"1533279876"
        //         },
        //         "time":"1533280294",
        //         "microtime":"0.36859200 1533280294",
        //         "source":"api"
        //     }
        //
        return this.parseOrder (response['data']);
    }

    async fetchOrdersWithMethod (method, symbol = undefined, since = undefined, limit = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOpenOrders requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'coinFrom': market['baseId'],
            'coinTo': market['quoteId'],
            // 'type': 1, // optional integer, 1 = buy, 2 = sell
            // 'page': 1, // optional integer
            // 'pageSize': 100, // optional integer, max 100
            // 'startTime': 1510235730, // optional integer timestamp in seconds
            // 'endTime': 1510235730, // optional integer timestamp in seconds
        };
        if (limit !== undefined) {
            request['page'] = 1;
            request['pageSize'] = limit;
        }
        if (since !== undefined) {
            request['startTime'] = parseInt (since / 1000);
            // request['endTime'] = parseInt (since / 1000);
        }
        const response = await this[method] (this.extend (request, params));
        //
        //     {
        //         "status": 200,
        //         "msg": "",
        //         "data": {
        //             "data": [
        //                 {
        //                     "id": "693248739",
        //                     "uid": "2074056",
        //                     "price": "100.00000000",
        //                     "number": "10.0000",
        //                     "total": "0.00000000",
        //                     "numberOver": "0.0000",
        //                     "numberDeal": "0.0000",
        //                     "flag": "sale",
        //                     "status": "3", // 0:unfilled, 1:partial deal, 2:all transactions, 3:already cancelled
        //                     "isNew": "N",
        //                     "coinFrom": "vtc",
        //                     "coinTo": "dkkt",
        //                     "created": "1533035300",
        //                 },
        //                 {
        //                     "id": "723086996",
        //                     "uid": "2074056",
        //                     "price": "100.00000000",
        //                     "number": "10.0000",
        //                     "total": "0.00000000",
        //                     "numberOver": "0.0000",
        //                     "numberDeal": "0.0000",
        //                     "flag": "sale",
        //                     "status": "3",
        //                     "isNew": "N",
        //                     "coinFrom": "bz",
        //                     "coinTo": "usdt",
        //                     "created": "1533523568",
        //                 },
        //             ],
        //             "pageInfo": {
        //                 "limit": "10",
        //                 "offest": "0",
        //                 "current_page": "1",
        //                 "page_size": "10",
        //                 "total_count": "17",
        //                 "page_count": "2",
        //             }
        //         },
        //         "time": "1533279329",
        //         "microtime": "0.15305300 1533279329",
        //         "source": "api"
        //     }
        //
        const orders = this.safeValue (response['data'], 'data', []);
        return this.parseOrders (orders, undefined, since, limit);
    }

    async fetchOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        return await this.fetchOrdersWithMethod ('tradePostGetUserHistoryEntrustSheet', symbol, since, limit, params);
    }

    async fetchOpenOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        return await this.fetchOrdersWithMethod ('tradePostGetUserNowEntrustSheet', symbol, since, limit, params);
    }

    async fetchClosedOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
        return await this.fetchOrdersWithMethod ('tradePostGetUserHistoryEntrustSheet', symbol, since, limit, params);
    }

    parseTransactionStatus (status) {
        const statuses = {
            '1': 'pending',
            '2': 'pending',
            '3': 'pending',
            '4': 'ok',
            '5': 'canceled',
        };
        return this.safeString (statuses, status, status);
    }

    parseTransaction (transaction, currency = undefined) {
        //
        //     {
        //         "id": '96275',
        //         "uid": '2109073',
        //         "wallet": '0xf4c4141c0127bc37b1d0c409a091920eba13ada7',
        //         "txid": '0xb7adfa52aa566f9ac112e3c01f77bd91179b19eab12092a9a5a8b33d5086e31d',
        //         "confirm": '12',
        //         "number": '0.50000000',
        //         "status": 4,
        //         "updated": '1534944168605',
        //         "addressUrl": 'https://etherscan.io/address/',
        //         "txidUrl": 'https://etherscan.io/tx/',
        //         "description": 'Ethereum',
        //         "coin": 'eth',
        //         "memo": ''
        //     }
        //
        //     {
        //         "id":"397574",
        //         "uid":"2033056",
        //         "wallet":"1AG1gZvQAYu3WBvgg7p4BMMghQD2gE693k",
        //         "txid":"",
        //         "confirm":"0",
        //         "number":"1000.00000000",
        //         "status":1,
        //         "updated":"0",
        //         "addressUrl":"http://omniexplorer.info/lookupadd.aspx?address=",
        //         "txidUrl":"http://omniexplorer.info/lookuptx.aspx?txid=",
        //         "description":"Tether",
        //         "coin":"usdt",
        //         "memo":""
        //     }
        //
        //     {
        //         "id":"153606",
        //         "uid":"2033056",
        //         "wallet":"1AG1gZvQAYu3WBvgg7p4BMMghQD2gE693k",
        //         "txid":"aa2b179f84cd6dedafd41845e0fbf7f01e14c0d71ea3140d03d6f5a9ccd93199",
        //         "confirm":"0",
        //         "number":"761.11110000",
        //         "status":4,
        //         "updated":"1536726133579",
        //         "addressUrl":"http://omniexplorer.info/lookupadd.aspx?address=",
        //         "txidUrl":"http://omniexplorer.info/lookuptx.aspx?txid=",
        //         "description":"Tether",
        //         "coin":"usdt",
        //         "memo":""
        //     }
        //
        let timestamp = this.safeInteger (transaction, 'updated');
        if (timestamp === 0) {
            timestamp = undefined;
        }
        const currencyId = this.safeString (transaction, 'coin');
        const code = this.safeCurrencyCode (currencyId, currency);
        const type = this.safeStringLower (transaction, 'type');
        const status = this.parseTransactionStatus (this.safeString (transaction, 'status'));
        return {
            'id': this.safeString (transaction, 'id'),
            'txid': this.safeString (transaction, 'txid'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'address': this.safeString (transaction, 'wallet'),
            'tag': this.safeString (transaction, 'memo'),
            'type': type,
            'amount': this.safeFloat (transaction, 'number'),
            'currency': code,
            'status': status,
            'updated': timestamp,
            'fee': undefined,
            'info': transaction,
        };
    }

    parseTransactionsByType (type, transactions, code = undefined, since = undefined, limit = undefined) {
        const result = [];
        for (let i = 0; i < transactions.length; i++) {
            const transaction = this.parseTransaction (this.extend ({
                'type': type,
            }, transactions[i]));
            result.push (transaction);
        }
        return this.filterByCurrencySinceLimit (result, code, since, limit);
    }

    parseTransactionType (type) {
        const types = {
            'deposit': 1,
            'withdrawal': 2,
        };
        return this.safeInteger (types, type, type);
    }

    async fetchDeposits (code = undefined, since = undefined, limit = undefined, params = {}) {
        return await this.fetchTransactionsForType ('deposit', code, since, limit, params);
    }

    async fetchWithdrawals (code = undefined, since = undefined, limit = undefined, params = {}) {
        return await this.fetchTransactionsForType ('withdrawal', code, since, limit, params);
    }

    async fetchTransactionsForType (type, code = undefined, since = undefined, limit = undefined, params = {}) {
        if (code === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchTransactions() requires a currency `code` argument');
        }
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request = {
            'coin': currency['id'],
            'type': this.parseTransactionType (type),
        };
        if (since !== undefined) {
            request['startTime'] = parseInt (since / 1000).toString ();
        }
        if (limit !== undefined) {
            request['page'] = 1;
            request['pageSize'] = limit;
        }
        const response = await this.tradePostDepositOrWithdraw (this.extend (request, params));
        const transactions = this.safeValue (response['data'], 'data', []);
        return this.parseTransactionsByType (type, transactions, code, since, limit);
    }

    nonce () {
        const currentTimestamp = this.seconds ();
        if (currentTimestamp > this.options['lastNonceTimestamp']) {
            this.options['lastNonceTimestamp'] = currentTimestamp;
            this.options['lastNonce'] = 100000;
        }
        this.options['lastNonce'] = this.sum (this.options['lastNonce'], 1);
        return this.options['lastNonce'];
    }

    sign (path, api = 'market', method = 'GET', params = {}, headers = undefined, body = undefined) {
        let url = this.urls['api'][api] + '/' + this.capitalize (api) + '/' + path;
        let query = undefined;
        if (api === 'market') {
            query = this.urlencode (params);
            if (query.length) {
                url += '?' + query;
            }
        } else {
            this.checkRequiredCredentials ();
            body = this.rawencode (this.keysort (this.extend ({
                'apiKey': this.apiKey,
                'timeStamp': this.seconds (),
                'nonce': this.nonce (),
            }, params)));
            body += '&sign=' + this.hash (this.encode (body + this.secret));
            headers = { 'Content-type': 'application/x-www-form-urlencoded' };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (httpCode, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return; // fallback to default error handler
        }
        const status = this.safeString (response, 'status');
        if (status !== undefined) {
            const feedback = this.id + ' ' + body;
            const exceptions = this.exceptions;
            //
            //     {"status":-107,"msg":"","data":"","time":1535968848,"microtime":"0.89092200 1535968848","source":"api"}
            //
            if (status === '200') {
                //
                //     {"status":200,"msg":"","data":-200031,"time":1535999806,"microtime":"0.85476800 1535999806","source":"api"}
                //
                const code = this.safeInteger (response, 'data');
                if (code !== undefined) {
                    if (code in exceptions) {
                        throw new exceptions[code] (feedback);
                    } else {
                        throw new ExchangeError (feedback);
                    }
                } else {
                    return; // no error
                }
            }
            if (status in exceptions) {
                throw new exceptions[status] (feedback);
            } else {
                throw new ExchangeError (feedback);
            }
        }
    }
};
