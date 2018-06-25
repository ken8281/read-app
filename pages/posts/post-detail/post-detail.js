var postsData = require("../../../data/posts-data.js");
var app = getApp();
Page({

  data: {
    isPlayingMusic: false
  },

  onLoad: function (options) {
    //页面加载
    var postId = options.id;
    var postData = postsData.postList[postId];
    this.setData({
      postData: postData
    });

    //缓存加载
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected)
    };

    //音乐监听与状态预设置

    if (app.gobleMusicSwitch[postId]) {

      this.setData({
        isPlayingMusic: app.gobleMusicSwitch[postId]
      });
    }


    var that = this;
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      });
    });

    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      });
    });

    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      });
      app.gobleMusicSwitch[postId] = false;
    });

  },

  //收藏与分享
  onColletionTap: function () {
    var postId = this.data.postData.postId;
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = !postsCollected[postId];
    postsCollected[postId] = postCollected;
    wx.setStorageSync('posts_collected', postsCollected);
    this.setData({
      collected: postCollected
    });
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功'
    })
  },

  onShareTap: function () {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ];
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        wx.showToast({
          title: '用户' + itemList[res.tapIndex]
        });
      }
    })
  },


  //音乐
  onMusicTap: function () {
    var isPlayingMusic = this.data.isPlayingMusic;
    var postId = this.data.postData.postId;
    app.gobleMusicSwitch = {};

    var that = this;
    var music = that.data.postData.music;

    if (isPlayingMusic) {

      that.setData({
        isPlayingMusic: false
      });

      app.gobleMusicSwitch[postId] = false;

      wx.pauseBackgroundAudio();

    } else {

      that.setData({
        isPlayingMusic: true
      });

      app.gobleMusicSwitch[postId] = true;

      wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.title,
        coverImgUrl: music.coverImg
      });


    }
  },

  //页面分享
  onShareAppMessage: function () {
    var title = this.data.postData.title;
    var postId = this.data.postData.postId;
    return {
      title: title,
      path: "/pages/posts/post-detail/post-detail?id=" + postId
    }
  }

})