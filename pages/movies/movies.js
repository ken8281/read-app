var app = getApp();
var util = require('../../utils/util.js');
Page({

  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
    totalStart: 0,
    totalCount: 20
  },

  onLoad: function (option) {
    //数据请求
    var inTheatersUrl = app.doubanBase + "/v2/movie/in_theaters" + "?start=0&&count=3";
    var comingSoonUrl = app.doubanBase + "/v2/movie/coming_soon" + "?start=0&&count=3";
    var top250Url = app.doubanBase + "/v2/movie/top250" + "?start=0&&count=3";

    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '正在上映');
    this.getMovieListData(top250Url, 'top250', '豆瓣Top250');
    
  },

  //数据请求与处理
  getMovieListData: function (url, settedKey, categoryTitle) {
    wx.request({
      url: url,
      method: "GET",
      header: {
        'content-type': 'json'
      },
      success: (function (res) {
        this.processDoubanData(res.data, settedKey, categoryTitle)
      }).bind(this),
      fail: function (error) {
        console.log(error);
      }
    })
  },

  processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...';
      };

      var stars = subject.rating.stars;
      // stars = util.convertToStarsArray(stars);

      var temp = {
        coverageUrl: subject.images.large,
        title: title,
        stars: util.convertToStarsArray(stars),
        average: subject.rating.average,
        movieId: subject.id
      };

      movies.push(temp);
    };
    if (settedKey == "searchResult" && this.data.searchResult.categoryTitle) {
      movies = this.data.searchResult.movies.concat(movies);
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
    this.setData(readyData);
  },

  //跳转至更多
  onMoreTap: function (event) {
    var url = 'more-movie/more-movie?categoryTitle=' + event.currentTarget.dataset.categoryTitle;
    wx.navigateTo({
      url: url,
    })
  },

  //搜索面板
  onBindFocus: function () {
    this.setData({
      containerShow: false,
      searchPanelShow: true,
    });
  },

  onBindConfirm: function (event) {
    var searchValue = event.detail.value;
    var searchUrl = app.doubanBase + "/v2/movie/search?q=" + searchValue;
    this.getMovieListData(searchUrl, 'searchResult', searchValue);
  },

  onCrossTap: function () {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      totalStart: 0,
      totalCount: 20
    });
  },
  //搜索面板触底
  onReachBottom: function () {
    if (this.data.searchPanelShow && this.data.searchResult.categoryTitle) {
      var totalStart = this.data.totalStart;
      totalStart += 20;
      var totalCount = this.data.totalCount;
      totalCount += 20;
      var searchValue = this.data.searchResult.categoryTitle;
      var url = app.doubanBase + "/v2/movie/search?q=" + searchValue +
        "&&start=" + totalStart + "&&count=" + totalCount;

      this.getMovieListData(url, 'searchResult', searchValue);
      this.setData({
        totalStart: totalStart,
        totalCount: totalCount
      });
    }
  },

  //跳转至详情
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieId;
    var movieUrl = "movie-detail/movie-detail?movieId=" + movieId;
    wx.navigateTo({
      url: movieUrl
    })
  },

})