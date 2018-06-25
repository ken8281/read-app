var app = getApp();
var util = require("../../../utils/util.js");

Page({

  data: {
    movies: []
  },

  onLoad: function (options) {
    var categoryTitle = options.categoryTitle;

    var inTheatersUrl = app.doubanBase + "/v2/movie/in_theaters";
    var comingSoonUrl = app.doubanBase + "/v2/movie/coming_soon";
    var top250Url = app.doubanBase + "/v2/movie/top250";

    switch (categoryTitle) {
      case '正在热映': this.getMovieListData(inTheatersUrl, 'in_theaters', '正在热映'); break;
      case '正在上映': this.getMovieListData(comingSoonUrl, 'coming_soon', '正在上映'); break;
      case '豆瓣Top250': this.getMovieListData(top250Url, 'top250', '豆瓣Top250'); break;
    };
    
    this.setData({
      totalStart: 0,
      totalCount: 20,
      categoryTitle: categoryTitle
    });
    
    wx.setNavigationBarTitle({
      title: categoryTitle
    });
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
    var moviesData = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...';
      };

      var stars = subject.rating.stars;

      var temp = {
        coverageUrl: subject.images.large,
        title: title,
        stars: util.convertToStarsArray(stars),
        average: subject.rating.average,
        movieId: subject.id
      };

      moviesData.push(temp);
    };
    var movies = this.data.movies.concat(moviesData);

    this.setData({
      movies: movies,
      settedKey: settedKey
    });
  },

  onReachBottom: function () {
    var totalStart = this.data.totalStart;
      totalStart += 20;
    var totalCount = this.data.totalCount;
      totalCount += 20;
    var categoryTitle = this.data.categoryTitle;
    var settedKey = this.data.settedKey;

    var url = app.doubanBase + "/v2/movie/" + settedKey +
      "?start=" + totalStart + "&&count=" + totalCount;
    
    this.getMovieListData(url, settedKey, categoryTitle); 
    this.setData({
      totalStart: totalStart,
      totalCount: totalCount
    });
  },

  //跳转至详情
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieId;
    var movieUrl = "../movie-detail/movie-detail?movieId=" + movieId;
    wx.navigateTo({
      url: movieUrl
    })
  }

})