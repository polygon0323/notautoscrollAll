//------------------------------------------------
//	すべてのTimelineの「自動スクロール」を一括変更するプラグイン
//	Author: @polygon0323
//------------------------------------------------
(function($, jn){

	// プラグイン情報 ここから
	// プラグイン情報の初期化
	if(!jn.pluginInfo)
		jn.pluginInfo = {};
	// プラグイン情報本体
	jn.pluginInfo['notautoscrollAll'] = {
		'name' : {
			'ja' : '自動スクロール一括変更',
			'en' : 'Disable Auto-scroll collectively'
		},
		'author' : {
			'en' : '@polygon0323'
		},
		"version" : "0.2",
		'file' : 'notautoscrollAll.js',
		'language' : ['ja'],
		"last_update" : "2013/04/13",
		'update_timezone' : '9',
		'jnVersion' : '4.2.2.0',
		'description' : {
			'ja' : '全タイムラインの「自動スクロールしない」を一括で設定します。',
			'en' : '"Disable Auto-scroll" collectively'
		},
		'updateinfo' : 'http://poly-tank.jp:81/trash/janetter/updateinfo.txt'
	};
	// プラグイン情報ここまで

	var pluginInfoClass = function(){};
	pluginInfoClass.prototype = {
		'autoScroll' : false,
		'menuString' : '<span>自動スクロールしない（一括）</span>',
	};

	var _pi = new pluginInfoClass();

	if(_Janetter_Window_Type == "main") {
		var options_build = jn.onContextMemuOptionsBuildStarted;

		//	オプションメニュー登録
		jn.onContextMemuOptionsBuildStarted = function(accounts) {
			options_build && options_build.apply(this, arguments);
			var tweet = $("#contextmenu-options");
			if(tweet.children('li[action="notautoscrollAll"]').length == 0) {
				console.log('autoScroll: Menu=' + _pi.autoScroll);
				$('li[action="resetunread"]', tweet)
					.after('<li action="notautoscrollAll">' + _pi.menuString + '</li>');
			}
		};

		//	メニュー表示ハンドラ
		var options_onshow = jn.contextMenu.onShowOptions;
		jn.contextMenu.onShowOptions = function(e, context) {
			options_onshow && options_onshow.apply(this, arguments);
			console.log('autoScroll: onShowOptions=' + _pi.autoScroll);
			$(this).children('li[action="notautoscrollAll"]')
				.empty()
				.toggleClass('icon', _pi.autoScroll)
				.append(_pi.autoScroll ?
					$('<span class="icon check"></span>' + _pi.menuString) :
					$(_pi.menuString));
		};

		//	トレンドメニュー表示ハンドラ
		//	なんだかオプションメニューはここもハンドルしないといかんタイミングがあるらしい
		var trends_onshow = jn.contextMenu.onShowTrends;
		jn.contextMenu.onShowTrends = function(e, context) {
			trends_onshow && trends_onshow.apply(this, arguments);
			console.log('autoScroll: onShowTrends=' + _pi.autoScroll);
			$(this).children('li[action="notautoscrollAll"]')
				.empty()
				.toggleClass('icon', _pi.autoScroll)
				.append(_pi.autoScroll ?
					$('<span class="icon check"></span>' + _pi.menuString) :
					$(_pi.menuString));
		};

		//	グローバルのショートカットキーを設定
		$(document).bind('keyup', function(e) {
			if($().jeegoocontextvisibled())
				return false;

			switch(e.keyCode) {
				case 19://	[Pause]
					console.log('autoScroll: onkeyUp=' + _pi.autoScroll);
					ChangeAutoScrollAll();
					return false;
			}
		});

		// アクションを定義
		var action = jn.action;
		jn.action = function(options) {
			var act = options.act,
				elm = options.element,
				event = options.event;
			
			action(options);
			if(act == "notautoscrollAll") {
				console.log('autoScroll: change=' + _pi.autoScroll);
				ChangeAutoScrollAll();
			} else if(act == "options") {
				jn.contextMenu.buildOptionsMenu(jn.accounts, jn.contextMenu.createAccountSubMenu(jn.accounts));
				jn.transMessage($('#contextmenu-options'));
			}
		};
	};

	//	タイムラインを列挙して「自動スクロールしない」フラグを書き換える
	function ChangeAutoScrollAll() {
		jn.get$Timelines().each(function() {
			this.controller.changeOption('autoscroll', _pi.autoScroll);
		});
		jn.saveTimelines();

		if(!_pi.autoScroll) {
			jn.notice('自動スクロールを「しない」にしました。');
		} else {
			jn.notice('自動スクロールを「する」にしました。');
		}

		_pi.autoScroll = !_pi.autoScroll;
	};

})(jQuery, janet);
