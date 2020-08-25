// Novel Checker js
// Copyright (c) 2018 syuribox

function get_id(id){
	return document.getElementById(id);
}

function html_escape(s){
	return s.replace(/&/g,"&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function book_change(){
	get_id('book_val').value = get_id('book').value;
}

function area_clear(){
	document.mainform.maintext.value = "";
}

function open_option(){
	if(get_id('check_options').style.display == 'none'){
		get_id('check_options').style.display = 'block';
	}else{
		get_id('check_options').style.display = 'none'
	}
}
function area_sample(){
	var sample = '';
	sample += '　地の文。\n';
	sample += '行頭空白。\n';
	sample += '　「空白括弧」\n';
	sample += '　疑問符の後の空白？　です？例外：「括弧の直前？」連続！？　疑問符！！！\n';
	sample += '句読後の空白、　句点後の空白。　行末でも有効。　\n';
	sample += '「セリフの句読点括弧。」\n';
	sample += '『あいうえお。\n';
	sample += '　かきくけこ。(さしすせそ。「「「括弧のネスト」」」)』\n';
	sample += '【括弧の対応がおかしいのも検出します」\n';
	sample += '　句読点連続、のチェック、、句点のチェック。。\n';
	sample += '　三点リーダ…または・・・正しいのは2の倍数個……\n';
	sample += '　ダッシューーまたは―正しいのは2の倍数個またの名をダーシ――\n';
	sample += '　行末が句読点括弧以外の場所は閉じ括弧ミスか。忘れの可能性があります\n';
	sample += '　ASCIIの半角123、ABC、全角１２３、ＡＢＣ、ａｂｃ。\n';
	sample += '　巫女　味噌　魑魅魍魎　囁く　聳える　😀👾🍄\n';
	sample += '　二クキュウ　インドへ　へクタール　チ－ト　ニ個　二ーチェ\n';
	sample += '■補足\n';
	sample += '　ダッシュには「あほーー」のような伸ばし棒が2つ以上の場合も警告表示されてしまいますが、問題ない場合もあります。ダッシュと伸ばし棒の書き間違いなら修正してください。\n'
	sample += '　空白括弧には行頭に行に埋め込まれた括弧文があるとそれも警告されてしまいます。\n'
	sample += '　常用漢字のリストには第三水準の「塡剝頰𠮟」を含めていません。「塡剝頰」は表外漢字の警告対象です。「𠮟」はサロゲート漢字として検出されます。\n';
	sample += '■第二話\n';
	sample += '　このように1文字目に置いてある■◆●▲▼のうち最初に現れるものを話の区切りと認識して、各話ごとの本文の文字数(改行空白を除く)を数えます。\n';
	sample += '　平均-1は末尾に「■終了」などのマークがあっても一つ少ない話数でカウントできるようになっています。\n';
	get_id('maintext').value = sample;
}

function fixnum(i){
	return ("_____" + i).substr(-6);
}

function is_kanji(c){
	if((0x4e00 <= c && c <= 0x9fcf)
		|| (0x3400 <= c && c <= 0x4dbf)
		|| (0xf900 <= c && c <= 0xfadf)){
		return true;
	}
	return false;
}

function surrogate_to_codepoint(s){
	var c0 = s.charCodeAt(0);
	var c1 = s.charCodeAt(1);
	c0 &= 0x3FF;
	c1 &= 0x3FF;
	return ((c0 << 10) | c1) + 0x10000;
}

function file_opens(e){
	read_files(e.target.files);
}

function read_files(files){
	var file_size = 0;
	for(var i = 0; i < files.length; i++){
		file_size += files[0].size;
	}
	if( 500000 < file_size ){
		if(false == window.confirm('合計ファイルサイズが500KB以上あります。\n' +
				'ファイル読み込みを処理しますか？')){
			return;
		}
	}
	var encoding = 'UTF-8';
	if(get_id('option_sjis').checked){
		encoding = 'Shift_JIS';
	}
	var loader = function(e){
		get_id('maintext').value = e.target.result;
	}
	var reader = new FileReader();
	reader.onload = loader;
	reader.readAsText(files[0], encoding);
}


function start_check(){
	var option_linetop = get_id('option_linetop').checked;
	var option_bracket_indent = get_id('option_bracket_indent').checked;
	var option_question_space = get_id('option_question_space').checked;
	var option_bracket_pair = get_id('option_bracket_pair').checked;
	var option_bracket_pair2 = get_id('option_bracket_pair2').checked;
	var option_bracket_period = get_id('option_bracket_period').checked;
	var option_repeat_period = get_id('option_repeat_period').checked;
	var option_santen = get_id('option_santen').checked;
	var option_dash = get_id('option_dash').checked;
	var option_line_end  = get_id('option_line_end').checked;
	var option_line_end_imp  = get_id('option_line_end_imp').checked;

	var option_full_alnum = get_id('option_full_alnum').checked;
	var option_full_alnum_imp = get_id('option_full_alnum_imp').checked;
	var option_half_alnum = get_id('option_half_alnum').checked;
	var option_half_alnum_imp = get_id('option_half_alnum_imp').checked;
	var option_katakana = get_id('option_katakana').checked;
	var option_katakana_imp = get_id('option_katakana_imp').checked;
	var option_kanji = get_id('option_kanji').checked;
	var option_kanji_imp = get_id('option_kanji_imp').checked;
	var option_kanji_jinmei = get_id('option_kanji_jinmei').checked;
	var option_kanji_jinmei_imp = get_id('option_kanji_jinmei_imp').checked;
	var option_kanji_daiiti = get_id('option_kanji_daiiti').checked;
	var option_kanji_daiiti_imp = get_id('option_kanji_daiiti_imp').checked;
	var option_kanji_ext = get_id('option_kanji_ext').checked;
	var option_kanji_ext_imp = get_id('option_kanji_ext_imp').checked;
	var option_kanji_emoji_imp = get_id('option_kanji_emoji_imp').checked;
	var option_kanji_etc_imp = get_id('option_kanji_etc_imp').checked;
	var option_linenum = get_id('option_linenum').checked;
	var option_view_warning_only = get_id('option_view_warning_only').checked;
	var option_entity = get_id('option_entity').checked;
	var custom_red = get_id('custom_red').value;
	var custom_gray = get_id('custom_gray').value;
	var custom_red_imp = get_id('custom_red_imp').checked;
	var custom_gray_imp = get_id('custom_gray_imp').checked;

	var rule_no_check = '----';

	var text = get_id('maintext').value;
	text = text.replace(/\r\n/g, "\n").replace(/\n+$/g, "");

	var book = get_id('book_val').value;
	var book_line = parseInt(book.replace(/([0-9]+)x([0-9]+)/, "$2"));
	var book_col = parseInt(book.replace(/([0-9]+)x([0-9]+)/, "$1"));
	var kanji_except = get_id('kanji_except').value;

	var line_val = 0;
	var col_val = 0;
	var char_count = 0;
	var char_count_all = 0;
	var line_count = 0;
	var end_line = false;
	for(var i = 0; i < text.length; i++){
		var c1 = text.charAt(i);
		if( c1 === '\n' ){
			col_val = 0;
			line_val++;
			line_count++;
			char_count_all++;
			end_line = true;
		}else{
			end_line = false;
			if( c1 === ' ' ){
				char_count_all++;
			}else if( c1 === '　' ){
				char_count_all++;
			}else if( c1 === '\t' ){
				char_count_all++;
			}else{
				char_count++;
			}
			col_val++;
			if( book_col < col_val ){
				col_val = 1;
				line_val++;
			}
		}
	}
	if( false == end_line ){
		line_val++;
		line_count++;
	}
	char_count_all += char_count;
	var book_val_down = Math.round((line_val) * 10 / book_line);
	var book_val_up = Math.floor(book_val_down / 10);
	book_val_down = book_val_down - book_val_up * 10;

	var char_hira = 0;
	var char_kata = 0;
	var char_kigou = 0;
	var char_ascii = 0;
	var char_kanji = 0;
	for(var i = 0; i < text.length; i++){
		var c2 = text.charAt(i);
		if( -1 !== c2.search(/[ぁ-\u309e]/) ){
			char_hira++;
		}else if( -1 !== c2.search(/[ァ-\u30ff]/) ){
			char_kata++;
		}else if( is_kanji(text.charCodeAt(i)) ){
			char_kanji++;
		}else if( -1 !== c2.search(/[\u0000-\u007f]/) ){
			if(c2 !== '\n'){
				char_ascii++;
			}
		}else{
			var cc = text.charCodeAt(i);
			var cc1 = text.charCodeAt(i + 1);
			var mozi = '';
			if(0xD800 <= cc && cc <= 0xDBFF){
				if(0xDC00 <= cc1 && cc1 <= 0xDFFF){
					mozi = text.substr(i, 2); // サロゲート正常
				}else{
					// 不正シーケンス
					mozi = text.substr(i, 1);
				}
			}else if(0xDC00 <= cc && cc <= 0xDFFF){
				// 不正シーケンス
				mozi = text.substr(i, 1);
			}
			if( 0 < mozi.length){
				if(2 === mozi.length){
					i++;
					var x = surrogate_to_codepoint(mozi);
					if(0x1F300 <= x && x <= 0x1FFFF){
						//絵文字->記号
					}else if(0x20000 <= x && x <= 0x3FFFF){
						//サロゲート漢字
						char_kanji++;
						continue;
					}
					//サロゲートその他
					char_kigou++;
					continue;
				}
				//サロゲート断片
				char_kigou++;
				continue;
			}
			// その他はとりあえず記号
			char_kigou++;
		}
	}

	text = html_escape(text);

	var text_head = '';
	var text_footer = '';
	var text_replace_list = [];
	var text_replace_list_img = [];
	var text_type = 'normal';
	if(text.substr(0,8) === '【ユーザ情報】\n'){
		// narou backup format
		var start_one = '\n------------------------- 第1部分開始 -------------------------\n';
		var start_pos = text.indexOf(start_one);
		if(-1 === start_pos){
			// 短編
			start_one = '\n【本文】\n';
			start_pos = text.indexOf(start_one);
		}
		if(-1 !== start_pos){
			text_type = 'backup';
			text_head = text.substr(0, start_pos + start_one.length - 1);
			text = text.substr(start_pos + start_one.length - 1);
			var footer_str = '\n【免責事項】\n本テキストデータの利用';
			var footer_pos = text.indexOf(footer_str);
			if(-1 !== footer_pos){
				text_footer = text.substr(footer_pos + 1);
				text = text.substr(0, footer_pos + 1);
			}
			text = text.replace(/ⓐ/g, 'ⓐⓩ');
			text = text.replace(/^(------------------------- 第\d+部分開始 -------------------------|【(第\d+章|前書き|本文|後書き)】)$/mg, function(s){
				text_replace_list.push(s);
				return '　ⓐⓓ。';
			});
			text = text.replace(/\n【サブタイトル】\n/g, '\n　ⓐⓑ');
			text = text.replace(/^([ \t　]*)\&lt;i(\d+)\|(\d+)\&gt;([ \t　]*)$/mg, function(s){
				text_replace_list_img.push(s);
				return '　ⓐⓒ';
			});
		}
	}
	if(text_type === 'normal' && -1 != text.indexOf('\n----------------\n')){
		text_type = 'narou_dl';
		text = text.replace(/ⓐ/g, 'ⓐⓩ');
		text = text.replace(/^([^\n]+)\n([^\n]+)\n/, function(s){
			text_replace_list.push(s);
			return '　ⓐⓓ。';
		});
		text = text.replace(/^(----------------|(\*{44})|(\*{48}))$/mg, function(s){
			text_replace_list.push(s);
			return '　ⓐⓓ。';
		});
		text = text.replace(/^([ \t　]*)\&amp;lt;i(\d+)\|(\d+)\&amp;gt;([ \t　]*)$/mg, function(s){
			text_replace_list_img.push(s);
			return '　ⓐⓒ';
		});
	}

	var rule_custom_red = 0;
	var rule_custom_gray = 0;
	if(0 < custom_red.length){
		try{
			text = text.replace(new RegExp(custom_red, 'g'), function (s){
					rule_custom_red++;
					return 'ⓐ㊀' + s +'ⓐ㊁';});
		}catch(e){
			alert('カスタム(赤)の正規表現が不正です。\n' + custom_red);
		}
	}else{
		rule_custom_red = rule_no_check;
	}
	if(0 < custom_gray.length){
		try{
			text = text.replace(new RegExp(custom_gray, 'g'), function (s){
					rule_custom_red++;
					return 'ⓐ㊂' + s +'ⓐ㊃';});
		}catch(e){
			alert('カスタム(灰)の正規表現が不正です。\n' + custom_gray);
		}
	}else{
		rule_custom_gray = rule_no_check;
	}

	var rule_half_alnum = 0;
	if( option_half_alnum ){
		text = text.replace(/&lt;/g, "&%;").replace(/&gt;/g, "&%%;").replace(/&amp;/g, "&%%%;");
		if(option_half_alnum_imp){
			text = text.replace(/[a-zA-Z_0-91,.\-]+/g, function(s){
				rule_half_alnum++;
				return '<span class="rule_highlight">{半角英数}</span><span class="rule_half_alnum">' + s + '</span>';
			});
		}else{
			text = text.replace(/[a-zA-Z_0-9,.\-]+/g, function(s){
				rule_half_alnum++;
				return '<span class="rule_half_alnum">' + s + '</span>';
			});
		}
		text = text.replace(/&%;/g, "&lt;").replace(/&%%;/g, "&gt;").replace(/&%%%;/g, "&amp;");
	}else{
		rule_half_alnum = rule_no_check;
	}

	var rule_linetop = 0;
	if(option_linetop){
		text = text.replace(/^[^「『【≪〈《〔（［｛＜\(　\n]/mg, function(s){
			rule_linetop++;
			return '<span class="rule_linetop">{行頭空白}</span>' + s;
		});
	}else{
		rule_linetop = rule_no_check;
	}
	var rule_bracket_indent = 0;
	if(option_bracket_indent){
		text = text.replace(/^[　 \t]+[「『【≪〈《〔（［｛＜\)]/mg, function(s){
			rule_bracket_indent++;
			return '<span class="rule_bracket_indent">{空白括弧}</span>' + s;
		});
	}else{
		rule_bracket_indent = rule_no_check;
	}
	var rule_bracket_period = 0;
	if(option_bracket_period){
		text = text.replace(/[,\.。、，．][」』】≫〉》〕）］｝＞\)]/g, function(s){
			rule_bracket_period++;
			return '<span class="rule_bracket_indent">{句読点括弧}' + s.substr(0,1) + '</span>' + s.substr(1);
		});
	}else{
		rule_bracket_period = rule_no_check;
	}
	var rule_question_space = 0;
	if(option_question_space){
		text = text.replace(/([？！\?\!⁈⁉☆♡♥♪]+)([^？！\?\!])/g, function(s, s1, s2){
			if( -1 == s2.search(/[　」』】≫〉》〕）］｝＞《（\)\n]/) ){
				rule_question_space++;
				return '<span class="rule_question_space">{句読点空白}' + s1 + '</span>' + s2;
			}
			return s;
		});
		text = text.replace(/([、。])([　 \t])/g, function(s, s1, s2){
			rule_question_space++;
			return '<span class="rule_question_space">{句読点空白}' + s + '</span>';
		});
		text = text.replace(/([\n「『【≪〈《〔（［｛＜])([、。])/g, function(s, s1, s2){
			rule_question_space++;
			return s1 + '<span class="rule_question_space">{文頭句読点}' + s2 + '</span>';
		});
		text = text.replace(/([　 \t])([、。])/g, function(s, s1, s2){
			rule_question_space++;
			return s1 + '<span class="rule_question_space">{空白句読点}' + s2 + '</span>';
		});
	}else{
		rule_question_space = rule_no_check;
	}
	var rule_katakana = 0;
	if( option_katakana ){
		if(option_katakana_imp){
			text = text.replace(/[ァ-ヴ･-ﾟ]([ァ-ヴ゛゜゙゚ー]*)/g, function(s){
				rule_katakana++;
				return '<span class="rule_highlight">{カタカナ}</span><span class="rule_katakana">' + s + '</span>';
			});
		}else{
			text = text.replace(/[ァ-ヴ･-ﾟ]([ァ-ヴ゛゜゙゚ー]*)/g, function(s){
				rule_katakana++;
				return '<span class="rule_katakana">' + s + '</span>';
			});
		}
	}else{
		rule_katakana = rule_no_check;
	}

	var rule_santen = 0;
	var rule_santen_mix = false;
	if(option_santen){
		var find_santen = 0;
		text = text.replace(/…+/g, function(s){
			find_santen++;
			if( s.length % 2 !== 0 ){
				rule_santen++;
				return '<span class="rule_santen">{三点リーダ}' + s + '</span>';
			}
			return s;
		});
		var find_santen_ex = 0;
		text = text.replace(/⋯+/g, function(s){
			find_santen_ex++;
			if( s.length % 2 !== 0 ){
				rule_santen++;
				return '<span class="rule_santen">{三点リーダ}' + s + '</span>';
			}
			return s;
		});
		if(0 < find_santen && 0 < find_santen_ex){
			rule_santen_mix = true;
		}
		text = text.replace(/([\(（《]?)(・(・+))([\)）》]?)/g, function(s,g1,g2,g3,g4){
			if(g1 !== '' && g4 !== ''){
				var x = '(（《'.indexOf(g1);
				var y = ')）》'.indexOf(g4);
				if( x !== -1 && x === y ){
					// ルビ
					return s;
				}
			}
			rule_santen++;
			return g1 + '<span class="rule_santen">{三点リーダ}' + g2 + '</span>' + g4;
		});
	}else{
		rule_santen = rule_no_check;
	}


	var rule_bracket_pair = 0;
	var rule_bracket_pair2 = 0;
	var rule_line_end = 0;
	var brackets = 0;
	var prev = true;
	var ignore_mode = false;
	var brackets_line = 0;
	var brackets_types_arr = [];
	var normal_line = 0;
	var line_type = 0;
	var line_num = 1;
	var in_tag = false;
	var in_mark = false;
	var preg_tag_end = 0;
	var brackets_char = 0;
	var normal_char = 0;
	var prev_eol = false;
	for(var i = 0; i < text.length; i++){
		var mozi = text.charAt(i);
		var brackets_types_1 = "「『【≪〈《〔［｛（([".indexOf(mozi);
		var brackets_types_2 = "」』】≫〉》〕］｝）)]".indexOf(mozi);
		if(prev_eol){
			prev_eol = false;
			if(0 < brackets){
				var s1 = '<span class="rule_bracket_inner' + ((brackets + 3) % 4 + 1) + '">';
				text = text.substr(0, i) + s1 + text.substr(i);
				i += s1.length;
			}
		}
		if( -1 !== brackets_types_1 ){
			brackets_types_arr.push(brackets_types_1);
			brackets++;
			var s1 = '<span class="rule_bracket_inner' + ((brackets + 3) % 4 + 1) + '">';
			if(1 < brackets){
				s1 = '</span>' + s1;
			}
			text = text.substr(0, i) + s1 + text.substr(i);
			i += s1.length;
			prev = false;
			if( line_type === 0 ){
				line_type = 1; // 台詞行
			}
		} else if( -1 !== brackets_types_2 ){
			brackets--;
			if( 0 <= brackets ){
				var postion = brackets_types_arr.length - 1;
				for(; 0 <= postion; postion--){
					if( brackets_types_arr[postion] === brackets_types_2 ){
						brackets_types_arr.splice(postion, 1);
						break;
					}
				}
				if( postion < 0 ){
					if(option_bracket_pair2){
						var s1 = '<span class="rule_bracket_pair">{括弧対応：種別}</span>';
						text = text.substr(0, i) + s1 + text.substr(i);
						i += s1.length;
						rule_bracket_pair2++;
					}
				}
			}
			if( 0 <= brackets ){
				var s2 = '</span>';
				if(1 <= brackets){
					s2 += '<span class="rule_bracket_inner' + ((brackets + 3) % 4 + 1) + '">';
				}
				text = text.substr(0, i + 1) + s2 + text.substr(i + 1);
				i += s2.length;
			}
			if( brackets < 0 ){
				brackets_types_arr = [];
				brackets = 0;
				if(option_bracket_pair2){
					var s1 = '<span class="rule_bracket_pair">{括弧対応：閉じ}</span>';
					text = text.substr(0, i) + s1 + text.substr(i);
					i += s1.length;
					rule_bracket_pair2++;
				}
			}
			// 閉じ括弧が後で普通の文字換算されてしまうので、ここで調整
			if( 0 === brackets ){
				brackets_char++;
				normal_char--;
			}
			prev = true;
		} else if( -1 !== mozi.search(/[）\)]/) ){
			// 心境の場合は行末可。ルビは考慮外
			prev = true;
		} else if( mozi === '\n' ){
			prev_eol = true;
			if( option_bracket_pair ){
				if( 0 < brackets && brackets <= 5 ){
					var s1 = '<span class="rule_bracket_pair">{括弧内改行}</span>';
					text = text.substr(0, i) + s1 + text.substr(i);
					i += s1.length;
					rule_bracket_pair++;
				}
			}
			if( prev === false && ignore_mode === false && option_line_end){
				if( text.substr(i-1, 1) !== '＞' ){
					// ＞は括弧ではないので個別チェックする(暫定)
					var s3 = '<span class="rule_line_end">＿</span>';
					var s3imp = '<span class="rule_line_end_imp">{行末文字}</span>';
					var s3_;
					if( option_line_end_imp ){
						s3_ = s3imp;
					}else{
						s3_ = s3;
					}
					text = text.substr(0, i) + s3_ + text.substr(i);
					i += s3_.length;
				}
				rule_line_end++;
			}
			prev = true;
			// line_type == 0の空行はカウントしない
			if( line_type === 1 ){
				brackets_line++;
			}else if( line_type === 2 ) {
				normal_line++;
			}
			line_type = 0;
			if(text_type !== 'normal'){
				var sub_head = text.substr(i + 1, 3);
				if(sub_head === '　ⓐⓓ'){
					ignore_mode = true;
					// reset
					for(; 0 < brackets; brackets--){
						var s1 = '<span class="rule_bracket_pair">{括弧対応：未閉じ}</span></span>';
						text = text.substr(0, i) + s1 + text.substr(i);
						i += s1.length;
						rule_bracket_pair2++;
					}
					brackets = 0;
					brackets_types_arr = [];
				}
				if(sub_head === '　ⓐⓑ' || sub_head === '　ⓐⓒ'){
					ignore_mode = true;
				}else{
					ignore_mode = false;
				}
			}
			if(0 < brackets){
				var s1 = '</span>';
				text = text.substr(0, i) + s1 + text.substr(i);
				i += s1.length;
			}
		} else if( -1 !== mozi.search(/[”〟―…⋯─\.。．？！\?\!⁈⁉!!☆★♡♥♪♫♬♩]/) ){
			prev = true;
		} else {
			if( line_type === 0 ){
				if( 0 < brackets ){
					line_type = 1; // 台詞中の改行の次の行
				}else{
					line_type = 2; // 通常行
				}
			}
			if(option_brank_line && -1 !== mozi.search(/[ \t　]/)){
				prev = true;
			}else{
				prev = false;
			}
		}
		if( mozi !== '\n' ){
			var in_mark2 = in_mark;
			var in_tag2 = in_tag;
			if( mozi === '{' && preg_tag_end === 2){
				in_mark2 = in_mark = true;
			}else if( mozi === '}' ){
				in_mark = false;
			}else if( mozi === '<' ){
				if( 'span ' === text.substr(i + 1, 5)){
					preg_tag_end = 1;
				}
				in_tag2 = in_tag = true;
			}else if( mozi === '>' ){
				in_tag = false;
				preg_tag_end = 2;
			}else{
				if(preg_tag_end === 2){
					preg_tag_end = 0;
				}
			}
			if(in_mark2 || in_tag2){
			}else{
				if( 0 < brackets ){
					brackets_char++;
				}else{
					normal_char++;
				}
			}
		}
	}
	if( brackets != 0 ){
		text = text + '</span>';
	}
	if( line_type === 1 ){
		brackets_line++;
	}else {
		normal_line++;
	}
	var brackets_line_per = Math.round(brackets_line * 100 / (brackets_line + normal_line));
	var brackets_char_per = Math.round(brackets_char * 100 / (brackets_char + normal_char));

	var char_all = char_hira + char_kata + char_kigou + char_ascii + char_kanji;
	if(0 === char_all){
		char_all = 1;
	}
	var char_hira_per = Math.round(char_hira * 100 / (char_all));
	var char_kata_per = Math.round(char_kata * 100 / (char_all));
	var char_kigou_per = Math.round(char_kigou * 100 / (char_all));
	var char_ascii_per = Math.round(char_ascii * 100 / (char_all));
	var char_kanji_per = Math.round(char_kanji * 100 / (char_all));

	if(!option_bracket_pair){
		rule_bracket_pair = rule_no_check;
	}
	if(!option_bracket_pair2){
		rule_bracket_pair2 = rule_no_check;
	}
	if(!option_line_end){
		rule_line_end = rule_no_check;
	}

	var rule_repeat_period = 0;
	if(option_repeat_period){
		text = text.replace(/[。、，．\.]{2,999}/g, function(s){
			rule_repeat_period++;
			return '<span class="rule_repeat_period">{句読点連続}' + s + '</span>';
		});
	}else{
		rule_repeat_period = rule_no_check;
	}
	var rule_dash = 0;
	if(option_dash){
		text = text.replace(/—/g,'―').replace(/―+/g, function(s){
			if( s.length % 2 !== 0 ){
				rule_dash++;
				return '<span class="rule_dash">{ダッシュ}' + s + '</span>';
			}else{
				return s;
			}
		});
		text = text.replace(/ー(ー+)/g, function(s){
			rule_dash++;
			return '<span class="rule_dash">{ダッシュ}' + s + '</span>';
		});
	}else{
		rule_dash = rule_no_check;
	}
	var rule_full_alnum = 0;
	if( option_full_alnum ){
		if(option_full_alnum_imp){
			text = text.replace(/[Ａ-Ｚａ-ｚ０-９－，．]+/g, function(s){
				rule_full_alnum++;
				return '<span class="rule_highlight">{全角英数}</span><span class="rule_full_alnum">' + s + '</span>';
			});
		}else{
			text = text.replace(/[Ａ-Ｚａ-ｚ０-９－，．]+/g, function(s){
				rule_full_alnum++;
				return '<span class="rule_full_alnum">' + s + '</span>';
			});
		}
	}else{
		rule_full_alnum = rule_no_check;
	}

	var rule_kanji = 0;
	var rule_kanji_jinmei = 0;
	var rule_kanji_daiiti = 0;
	var rule_kanji_surrogate = 0;
	if(option_kanji || option_kanji_jinmei || option_kanji_daiiti || option_kanji_ext || option_kanji_emoji_imp || option_kanji_etc_imp){
		var len = text.length;
		var kanji = ret_kanji_list();
		var kanji_jyoyo = kanji.jyoyo;
		var kanji_jinmei = kanji.jinmei;
		var kanji_daiiti = kanji.daiiti;
		for(var i = 0; i < len; i++){
			var cc = text.charCodeAt(i);
			var cc1 = text.charCodeAt(i + 1);
			var mozi = '';
			if(0xD800 <= cc && cc <= 0xDBFF){
				if(0xDC00 <= cc1 && cc1 <= 0xDFFF){
					mozi = text.substr(i, 2); // サロゲート正常
				}else{
					// 不正シーケンス
					mozi = text.substr(i, 1);
				}
			}else if(0xDC00 <= cc && cc <= 0xDFFF){
				// 不正シーケンス
				mozi = text.substr(i, 1);
			}
			if( 0 < mozi.length){
				var name = 'サロゲートその他';
				var warning = false;
				if(2 === mozi.length){
					var x = surrogate_to_codepoint(mozi);
					if(0x1F300 <= x && x <= 0x1FFFF){
						if(option_kanji_emoji_imp){
							name = 'サロゲート絵文字';
							warning = true;
						}else{
							// 警告から除く
							i += 1;
							continue;
						}
					}else if(0x20000 <= x && x <= 0x3FFFF){
						if(option_kanji_ext){
							if(option_kanji_ext_imp){
								name = 'サロゲート漢字';
								warning = true;
							}
						}else{
							i += 1;
							continue;
						}
					}else if(option_kanji_etc_imp){
						warning = true;
					}else{
						i += 1;
						continue;
					}
				}else{
					name = 'サロゲート断片';
					warning = true;
				}
				var s1 ='';
				if(warning){
					s1 = '<span class="rule_highlight">{' + name + '}</span>';
				}
				s1 += '<span class="rule_kanji">';
				var s2 = '</span>';
				text = text.substr(0, i) + s1 + mozi + s2 + text.substr(i + mozi.length);
				var n = s1.length + s2.length + mozi.length - 1;
				len += n;
				i += n;
				rule_kanji_surrogate++;
				continue;
			}
			if(!is_kanji(cc)){
				continue;// 漢字以外
			}
			var c0 = text.charAt(i);
			if(-1 != kanji_jyoyo.indexOf(c0)){
				continue;
			}
			if(-1 != kanji_except.indexOf(c0)){
				continue; // 除外
			}
			if(-1 != kanji_jinmei.indexOf(c0)){
				if(option_kanji_jinmei){
					var s1 = '<span class="rule_kanji_jinmei">';
					if(option_kanji_imp){
						s1 = '<span class="rule_highlight">{人名漢字}</span>' + s1;
					}
					var s2 = '</span>';
					text = text.substr(0, i) + s1 + c0 + s2 + text.substr(i + 1);
					var n = s1.length + s2.length;
					len += n;
					i += n;
					rule_kanji_jinmei++;
				}
				continue;
			}if(-1 != kanji_daiiti.indexOf(c0)){
				if(option_kanji_daiiti){
					var s1 = '<span class="rule_kanji_daiiti">';
					if(option_kanji_daiiti_imp){
						s1 = '<span class="rule_highlight">{第一漢字}</span>' + s1;
					}
					var s2 = '</span>';
					text = text.substr(0, i) + s1 + c0 + s2 + text.substr(i + 1);
					var n = s1.length + s2.length;
					len += n;
					i += n;
					rule_kanji_daiiti++;
				}
				continue;
			}
			{
				if(option_kanji){
					var s1 = '<span class="rule_kanji">';
					if(option_kanji_imp){
						s1 = '<span class="rule_highlight">{表外漢字}</span>' + s1;
					}
					var s2 = '</span>';
					text = text.substr(0, i) + s1 + c0 + s2 + text.substr(i + 1);
					var n = s1.length + s2.length;
					len += n;
					i += n;
					rule_kanji++;
				}
			}
		}
	}
	if(!rule_kanji){
		rule_kanji = rule_no_check;
	}
	if(!option_kanji_jinmei){
		rule_kanji_jinmei = rule_no_check;
	}
	if(!option_kanji_daiiti){
		rule_kanji_daiiti = rule_no_check;
	}

	var custom_span = function (rx_, begin_, end_, imp_, css_){
		var hit_level = false;
		var warning_tag = false;
		var imp_css = imp_ + css_;
		text = text.replace(rx_, function(s){
			if(s === begin_){
				hit_level = true;
				return imp_css;
			}
			if(s === end_){
				hit_level = false;
				return '</span>';
			}
			if(s.substr(0,6)  === '<span '){
				if(s.substr(s.length - 1, 1) === '{'){ //'}'
					warning_tag = true;
					return s;
				}
				if(hit_level){
					return '</span>' + s + css_;
				}
				return s;
			}
			if(warning_tag){
				warning_tag = false;
				return '</span>';
			}
			if(hit_level){
				return '</span></span>' + css_;
			}
			return '</span>';
		});
	}
	if(0 < custom_red.length){
		custom_span(/ⓐ[㊀㊁]|<span ([^\n>]+)>({?)|<\/span>/g, 'ⓐ㊀', 'ⓐ㊁',
			custom_red_imp ? '<span class="rule_highlight">{カスタム赤}</span>' : '',
			'<span class="rule_custom_red">');
	}
	if(0 < custom_gray.length){
		custom_span(/ⓐ[㊂㊃]|<span ([^\n>]+)>({?)|<\/span>/g, 'ⓐ㊂', 'ⓐ㊃',
			custom_gray_imp ? '<span class="rule_highlight">{カスタム灰}</span>' : '',
			'<span class="rule_custom_gray">');
	}

	if(text_type !== 'normal'){
		var replace_count = 0;
		text = text.replace(/　ⓐⓒ/g, function(){
			var x = text_replace_list_img[replace_count];
			replace_count++;
			return x;
		});
		if(text_type === 'backup'){
			text = text.replace(/　ⓐⓑ/g, '【サブタイトル】\n');
		}
		replace_count = 0;
		text = text.replace(/　ⓐⓓ。/g, function(){
			var x = text_replace_list[replace_count];
			replace_count++;
			return x;
		});
		text = text.replace(/ⓐⓩ/g, 'ⓐ');
	}
	if(text_head !== ''){
		text = text_head + text;
	}
	if(text_footer !== ''){
		text += text_footer;
	}

	if(option_entity){
		text = text.replace(/&amp;/g, '&');
	}

	if(option_linenum){
		line_num = 1;
		text = text.replace(/\n/g, function(){
				line_num++;
				return '\n<span class="linenum">' + fixnum(line_num) + ':</span> ';
		});
		text = '<span class="linenum">' + fixnum(1) + ': </span>' + text;
	}

	if(option_view_warning_only){
		text = text.replace(/^.*$/mg, function(s){
				if( -1 != s.search(/<span class="rule_[a-z0-9_]+">{[^\n{}]+}/)){
					return s;
				}
				return '';
		});
		text = text.replace(/\n+/g, "\n");
	}
	if(rule_santen_mix){
		text = '<span class="rule_santen">※{三点リーダ}……(U+2026)と⋯⋯(U+22EF)が混在しています。</span>\n' + text;
	}

	text = text.replace(/\n/g, "<br>\n");

	var rules = '<table class="rule_result">';
	rules += '<tr class="rule_tr"><td class="rule_type">　　項目</td><td class="rule_type">　　値</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">原稿用紙(' + html_escape(book)+ '行)</td><td class="rule_value">' + book_val_up + '.' + book_val_down + '枚</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">文字数(空白改行除く)</td><td class="rule_value">' + char_count + '文字</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">文字数(空白改行含む)</td><td class="rule_value">' + char_count_all + '文字</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">行数</td><td class="rule_value">' + line_count + '行</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">台詞：地の文　台詞率</td><td class="rule_value">' + brackets_line + '：' + normal_line + '行 ' + brackets_line_per + '%';
		rules += ' ／ ' + brackets_char + '：' + normal_char + '文字 ' + brackets_char_per + '%</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">かな: カナ: 漢字: 他: ASCII</td><td class="rule_value">' + char_hira + ': ' + char_kata  + ': ' + char_kanji + ': ' + char_kigou + ': ' + char_ascii + '文字</td></tr>'
	rules += '<tr class="rule_tr"><td class="rule_type">文字種%</td><td class="rule_value">ひら' +
		char_hira_per + ': カタ' + char_kata_per  + ': 漢字' + char_kanji_per + ': 他' + char_kigou_per + ': A' + char_ascii_per + '%</td></tr>'

	rules += '<tr class="rule_tr"><td class="rule_type">　　項目</td><td class="rule_type">　　検出数</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">行頭空白</td><td class="rule_value">　' + rule_linetop + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">空白括弧</td><td class="rule_value">　' + rule_bracket_indent + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">句読点空白</td><td class="rule_value">　' + rule_question_space + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">括弧内改行</td><td class="rule_value">　' + rule_bracket_pair + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">括弧対応</td><td class="rule_value">　' + rule_bracket_pair2 + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">句読点括弧</td><td class="rule_value">　' + rule_bracket_period + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">句読点連続</td><td class="rule_value">　' + rule_repeat_period + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">三点リーダ</td><td class="rule_value">　' + rule_santen + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">ダッシュ</td><td class="rule_value">　' + rule_dash + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">行末文字</td><td class="rule_value">　' + rule_line_end;
	if( option_line_end && false == option_line_end_imp ){
		rules += '　※<span class="rule_line_end">＿</span>(アンダーバー)';
	}
	rules += '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">全角英数</td><td class="rule_value">　' + rule_full_alnum;
	if( option_full_alnum ){
		rules += '　※<span class="rule_full_alnum">背景色</span>'
	}
	rules += '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">半角英数</td><td class="rule_value">　' + rule_half_alnum;
	if( option_half_alnum ){
		rules += '　※<span class="rule_half_alnum">背景色</span>';
	}
	rules += '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">表外漢字(常用人名以外)<br>　+サロゲート</td><td class="rule_value">　' + rule_kanji + '　※<span class="rule_kanji">背景色</span><br>　' + rule_kanji_surrogate + '</td></tr>';
	rules += '<tr class="rule_tr"><td class="rule_type">人名漢字<br>第一漢字</td><td class="rule_value">　' + rule_kanji_jinmei + '　※<span class="rule_kanji_jinmei">背景色</span><br>　' + rule_kanji_daiiti + '　※<span class="rule_kanji_daiiti">背景色</span></td></tr>';
	if(0 < custom_red.length){
		rules += '<tr class="rule_tr"><td class="rule_type">カスタム赤</td><td class="rule_value">　' + rule_custom_red + '　※<span class="rule_custom_red">背景色</span></td></tr>';
	}
	if(0 < custom_gray.length){
		rules += '<tr class="rule_tr"><td class="rule_type">カスタム灰</td><td class="rule_value">　' + rule_custom_gray + '　※<span class="rule_custom_gray">背景色</span></td></tr>';
	}
	rules += '</table><br>'

	get_id("result").innerHTML = rules + '<div class="resultext">' + text + '</div>';
}

function check_katakana(exp){
	var text = get_id('maintext').value;
	text = text.replace(/\r\n/g, "\n").replace(/\n+$/g, "");
	var map = {};
	text.replace(exp, function(a){
			if(a in map){
				map[a] += 1;
			}else{
				map[a] = 1;
			}
			return a;
		}
	);
	var temp = [];
	var i = 0;
	for(var key in map){
		temp[i] = key + ' ' +map[key];
		i++;
	}
	temp.sort();
	var size = temp.length;
	var output = "";
	for(i = 0; i < size; i++){
		output += temp[i] + "\n"
	}
	return output;
}

function start_check_katakana(){
	var output = "";
	output += "■カタカナ一覧\n";
	output += check_katakana(/[ァ-ヺ][ァ-ヺー゛゜゙゚]*/g);
	output += "\n■前後がひらがな「へ」\n";
	output += check_katakana(/[へべぺ]+[ァ-ヺー゛゜゙゚]+/g);
	output += check_katakana(/[ァ-ヺ][ァ-ヺー゛゜゙゚]*[へべぺ]+/g);
	output += "\n■カナ罫線\n";
	output += check_katakana(/[ァ-ヺ][ァ-ヺー゛゜゙゚]*[―—–‒－−─]+/g);
	output += "\n■漢字[力口□ニ]\n";
	output += check_katakana(/[力口□二][ァ-ヺー゛゜゙゚]+/g);
	output += check_katakana(/[ァ-ヺ][ァ-ヺー゛゜゙゚]*[力口□二]/g);
	var text = output.replace(/\n/g, "<br>")
	get_id('result').innerHTML = '<div class="resultext">' + text + '</div>';
}

function start_check_alpha(){
	var output = '';
	output += '■英語一覧\n';
	output += check_katakana(/[a-zA-Z\-_]+/g);
	output += check_katakana(/[ａ-ｚＡ-Ｚ＿－゙゚]+/g);
	var text = output.replace(/\n/g, "<br>")
	get_id('result').innerHTML = '<div class="resultext">' + text + '</div>';
}

function start_check_kanji_listup(){
	var text = get_id('maintext').value;
	text = text.replace(/\r\n/g, "\n").replace(/\n+$/g, "");

	var output = "";

	var rule_kanji = 0;
	var rule_kanji_jinmei = 0;
	var rule_kanji_daiiti = 0;
	var rule_kanji_ext = 0;
	
	var len = text.length;
	var kanji = ret_kanji_list();
	var kanji_jyoyo = kanji.jyoyo;
	var kanji_jinmei = kanji.jinmei;
	var kanji_daiiti = kanji.daiiti;
	var kanji_list = '';
	var kanji_list_jinmei = '';
	var kanji_list_daiiti = '';
	var kanji_list_ext = ''; // サロゲート
	for(var i = 0; i < len; i++){
		var cc = text.charCodeAt(i);
		var cc1 = text.charCodeAt(i + 1);
		var mozi = '';
		if(0xD800 <= cc && cc <= 0xDBFF){
			if(0xDC00 <= cc1 && cc1 <= 0xDFFF){
				mozi = text.substr(i, 2); // サロゲート正常
			}else{
				// 不正シーケンス
				mozi = text.substr(i, 1);
			}
		}else if(0xDC00 <= cc && cc <= 0xDFFF){
			// 不正シーケンス
			mozi = text.substr(i, 1);
		}
		if( 0 < mozi.length){
			if(2 === mozi.length){
				i++;
				var x = surrogate_to_codepoint(mozi);
				if(0x1F300 <= x && x <= 0x1FFFF){
					//絵文字->記号
				}else if(0x20000 <= x && x <= 0x3FFFF){
					//サロゲート漢字
					if(-1 === kanji_list_ext.indexOf(mozi)){
						kanji_list_ext += mozi;
					}
					rule_kanji_ext++;
					continue;
				}
				//サロゲートその他
				continue;
			}
			//サロゲート断片
			continue;
		}
		if(!is_kanji(cc)){
			continue;// 漢字以外
		}
		var c = text.charAt(i);
		if(-1 !== kanji_jyoyo.indexOf(c)){
			continue;
		}
		if(-1 !== kanji_jinmei.indexOf(c)){
			if(-1 === kanji_list_jinmei.indexOf(c)){
				kanji_list_jinmei += c;
			}
			rule_kanji_jinmei++;
			continue;
		}
		if(-1 !== kanji_daiiti.indexOf(c)){
			if(-1 === kanji_list_daiiti.indexOf(c)){
				kanji_list_daiiti += c;
			}
			rule_kanji_daiiti++;
			continue;
		}
		if(-1 === kanji_list.indexOf(c)){
			kanji_list += c;
		}
		rule_kanji++;
	}
	var kanji_len = kanji_list.length;
	var kanji_jinmei_len = kanji_list_jinmei.length;
	var kanji_daiiti_len = kanji_list_daiiti.length;
	var kanji_ext_len = kanji_list_ext.length / 2;

	kanji_list = kanji_list.replace(/.{20}/g, "$&\n");
	kanji_list_jinmei = kanji_list_jinmei.replace(/.{20}/g, "$&\n");
	kanji_list_daiiti = kanji_list_daiiti.replace(/.{20}/g, "$&\n");
	kanji_list_ext = kanji_list_ext.replace(/.{40}/g, "$&\n");

	output += '■使用第一表外漢字一覧((常用+人名+第一水準)以外)\n';
	output += kanji_len + '字 ' + rule_kanji + '箇所\n'
	output += kanji_list;
	output += '\n■使用人名漢字一覧\n';
	output += kanji_jinmei_len + '字 ' + rule_kanji_jinmei + '箇所\n'
	output += kanji_list_jinmei;
	output += '\n■使用第一水準((人名+常用)以外)漢字一覧\n';
	output += kanji_daiiti_len + '字 ' + rule_kanji_daiiti + '箇所\n'
	output += kanji_list_daiiti;
	output += '\n■サロゲート漢字一覧\n';
	output += kanji_ext_len + '字 ' + rule_kanji_ext + '箇所\n'
	output += kanji_list_ext;

	var text = output.replace(/\n/g, "<br>")
	get_id('result').innerHTML = '<div class="resultext">' + text + '</div>';
}

function ret_kanji_list(){
	var jyoyo = 
	'亜哀挨愛曖悪握圧扱宛嵐安案暗以衣位囲医依委威為畏胃尉異移萎偉椅彙意違維慰遺緯域育一壱逸茨芋引印因咽姻' +
	'員院淫陰飲隠韻右宇羽雨唄鬱畝浦運雲永泳英映栄営詠影鋭衛易疫益液駅悦越謁閲円延沿炎怨宴媛援園煙猿遠鉛塩' +
	'演縁艶汚王凹央応往押旺欧殴桜翁奥横岡屋億憶臆虞乙俺卸音恩温穏下化火加可仮何花佳価果河苛科架夏家荷華菓' +
	'貨渦過嫁暇禍靴寡歌箇稼課蚊牙瓦我画芽賀雅餓介回灰会快戒改怪拐悔海界皆械絵開階塊楷解潰壊懐諧貝外劾害崖' +
	'涯街慨蓋該概骸垣柿各角拡革格核殻郭覚較隔閣確獲嚇穫学岳楽額顎掛潟括活喝渇割葛滑褐轄且株釜鎌刈干刊甘汗' +
	'缶完肝官冠巻看陥乾勘患貫寒喚堪換敢棺款間閑勧寛幹感漢慣管関歓監緩憾還館環簡観韓艦鑑丸含岸岩玩眼頑顔願' +
	'企伎危机気岐希忌汽奇祈季紀軌既記起飢鬼帰基寄規亀喜幾揮期棋貴棄毀旗器畿輝機騎技宜偽欺義疑儀戯擬犠議菊' +
	'吉喫詰却客脚逆虐九久及弓丘旧休吸朽臼求究泣急級糾宮救球給嗅窮牛去巨居拒拠挙虚許距魚御漁凶共叫狂京享供' +
	'協況峡挟狭恐恭胸脅強教郷境橋矯鏡競響驚仰暁業凝曲局極玉巾斤均近金菌勤琴筋僅禁緊錦謹襟吟銀区句苦駆具惧' +
	'愚空偶遇隅串屈掘窟熊繰君訓勲薫軍郡群兄刑形系径茎係型契計恵啓掲渓経蛍敬景軽傾携継詣慶憬稽憩警鶏芸迎鯨' +
	'隙劇撃激桁欠穴血決結傑潔月犬件見券肩建研県倹兼剣拳軒健険圏堅検嫌献絹遣権憲賢謙鍵繭顕験懸元幻玄言弦限' +
	'原現舷減源厳己戸古呼固股虎孤弧故枯個庫湖雇誇鼓錮顧五互午呉後娯悟碁語誤護口工公勾孔功巧広甲交光向后好' +
	'江考行坑孝抗攻更効幸拘肯侯厚恒洪皇紅荒郊香候校耕航貢降高康控梗黄喉慌港硬絞項溝鉱構綱酵稿興衡鋼講購乞' +
	'号合拷剛傲豪克告谷刻国黒穀酷獄骨駒込頃今困昆恨根婚混痕紺魂墾懇左佐沙査砂唆差詐鎖座挫才再災妻采砕宰栽' +
	'彩採済祭斎細菜最裁債催塞歳載際埼在材剤財罪崎作削昨柵索策酢搾錯咲冊札刷刹拶殺察撮擦雑皿三山参桟蚕惨産' +
	'傘散算酸賛残斬暫士子支止氏仕史司四市矢旨死糸至伺志私使刺始姉枝祉肢姿思指施師恣紙脂視紫詞歯嗣試詩資飼' +
	'誌雌摯賜諮示字寺次耳自似児事侍治持時滋慈辞磁餌璽鹿式識軸七叱失室疾執湿嫉漆質実芝写社車舎者射捨赦斜' +
	'煮遮謝邪蛇尺借酌釈爵若弱寂手主守朱取狩首殊珠酒腫種趣寿受呪授需儒樹収囚州舟秀周宗拾秋臭修袖終羞習週就' +
	'衆集愁酬醜蹴襲十汁充住柔重従渋銃獣縦叔祝宿淑粛縮塾熟出述術俊春瞬旬巡盾准殉純循順準潤遵処初所書庶暑署' +
	'緒諸女如助序叙徐除小升少召匠床抄肖尚招承昇松沼昭宵将消症祥称笑唱商渉章紹訟勝掌晶焼焦硝粧詔証象傷奨照' +
	'詳彰障憧衝賞償礁鐘上丈冗条状乗城浄剰常情場畳蒸縄壌嬢錠譲醸色拭食植殖飾触嘱織職辱尻心申伸臣芯身辛侵信' +
	'津神唇娠振浸真針深紳進森診寝慎新審震薪親人刃仁尽迅甚陣尋腎須図水吹垂炊帥粋衰推酔遂睡穂随髄枢崇数据杉' +
	'裾寸瀬是井世正生成西声制姓征性青斉政星牲省凄逝清盛婿晴勢聖誠精製誓静請整醒税夕斥石赤昔析席脊隻惜戚責' +
	'跡積績籍切折拙窃接設雪摂節説舌絶千川仙占先宣専泉浅洗染扇栓旋船戦煎羨腺詮践箋銭潜線遷選薦繊鮮全前善然' +
	'禅漸膳繕狙阻祖租素措粗組疎訴塑遡礎双壮早争走奏相荘草送倉捜挿桑巣掃曹曽爽窓創喪痩葬装僧想層総遭槽踪操' +
	'燥霜騒藻造像増憎蔵贈臓即束足促則息捉速側測俗族属賊続卒率存村孫尊損遜他多汰打妥唾堕惰駄太対体耐待怠胎' +
	'退帯泰堆袋逮替貸隊滞態戴大代台第題滝宅択沢卓拓託濯諾濁但達脱奪棚誰丹旦担単炭胆探淡短嘆端綻誕鍛団男段' +
	'断弾暖談壇地池知値恥致遅痴稚置緻竹畜逐蓄築秩窒茶着嫡中仲虫沖宙忠抽注昼柱衷酎鋳駐著貯丁弔庁兆町長挑帳' +
	'張彫眺釣頂鳥朝貼超腸跳徴嘲潮澄調聴懲直勅捗沈珍朕陳賃鎮追椎墜通痛塚漬坪爪鶴低呈廷弟定底抵邸亭貞帝訂庭' +
	'逓停偵堤提程艇締諦泥的笛摘滴適敵溺迭哲鉄徹撤天典店点展添転田伝殿電斗吐妬徒途都渡塗賭土奴努度怒刀冬' +
	'灯当投豆東到逃倒凍唐島桃討透党悼盗陶塔搭棟湯痘登答等筒統稲踏糖頭謄藤闘騰同洞胴動堂童道働銅導瞳峠匿特' +
	'得督徳篤毒独読栃凸突届屯豚頓貪鈍曇丼那奈内梨謎鍋南軟難二尼弐匂肉虹日入乳尿任妊忍認寧熱年念捻粘燃悩納' +
	'能脳農濃把波派破覇馬婆罵拝杯背肺俳配排敗廃輩売倍梅培陪媒買賠白伯拍泊迫舶博薄麦漠縛爆箱箸畑肌八鉢発' +
	'髪伐抜罰閥反半氾犯帆汎伴判坂阪板版班畔般販斑飯搬煩頒範繁藩晩番蛮盤比皮妃否批彼披肥非卑飛疲秘被悲扉費' +
	'碑罷避尾眉美備微鼻膝肘匹必泌筆姫百氷表俵票評漂標苗秒病描猫品浜貧賓頻敏瓶不夫父付布扶府怖阜附訃負赴浮' +
	'婦符富普腐敷膚賦譜侮武部舞封風伏服副幅復福腹複覆払沸仏物粉紛雰噴墳憤奮分文聞丙平兵併並柄陛閉塀幣弊蔽' +
	'餅米壁璧癖別蔑片辺返変偏遍編弁便勉歩保哺捕補舗母募墓慕暮簿方包芳邦奉宝抱放法泡胞俸倣峰砲崩訪報蜂豊飽' +
	'褒縫亡乏忙坊妨忘防房肪某冒剖紡望傍帽棒貿貌暴膨謀北木朴牧睦僕墨撲没勃堀本奔翻凡盆麻摩磨魔毎妹枚昧埋' +
	'幕膜枕又末抹万満慢漫未味魅岬密蜜脈妙民眠矛務無夢霧娘名命明迷冥盟銘鳴滅免面綿麺茂模毛妄盲耗猛網目黙門' +
	'紋問冶夜野弥厄役約訳薬躍闇由油喩愉諭輸癒唯友有勇幽悠郵湧猶裕遊雄誘憂融優与予余誉預幼用羊妖洋要容庸揚' +
	'揺葉陽溶腰様瘍踊窯養擁謡曜抑沃浴欲翌翼拉裸羅来雷頼絡落酪辣乱卵覧濫藍欄吏利里理痢裏履璃離陸立律慄略柳' +
	'流留竜粒隆硫侶旅虜慮了両良料涼猟陵量僚領寮療瞭糧力緑林厘倫輪隣臨瑠涙累塁類令礼冷励戻例鈴零霊隷齢麗暦' +
	'歴列劣烈裂恋連廉練錬呂炉賂路露老労弄郎朗浪廊楼漏籠六録麓論和話賄脇惑枠湾腕';
	var jyoyo_ex = '塡剝頰'; // 第三水準
	var jyoyo_ex2 = '𠮟'; // 第三水準・Unicode2面
	var jinmei = 
	'丑丞乃之乎也云亘亙些亦亥亨亮仔伊伍伽佃佑伶侃侑俄俣俐倭倦倖偲' +
	'傭儲允兎兜其冴凌凜凛凧凪凰凱函劉劫勁勺勿匁匡廿卜卯卿厨厩叉叡' +
	'叢叶只吾吻哉哨啄哩喬喧喰喋嘩嘉嘗噌噂圃圭坐尭堯坦埴堰堺堵塙壕' +
	'壬夷奄奎套娃姪姥娩嬉孟宏宋宕宥寅寓寵尖尤屑峨峻崚嵯嵩嶺巌巖已' +
	'巳巴巷巽帖幌幡庄庇庚庵廟廻弘弛彗彦彪彬徠忽怜恢恰恕悌惟惚悉惇' +
	'惹惺惣慧憐戊或戟托按挺挽掬捲捷捺捧掠揃摺撒撰撞播撫擢孜敦斐斡' +
	'斧斯於旭昂昊昏昌昴晏晃晄晒晋晟晦晨智暉暢曙曝曳朋朔杏杖杜李杭' +
	'杵杷枇柑柴柘柊柏柾柚桧檜栞桔桂栖桐栗梧梓梢梛梯桶梶椛梁棲椋椀' +
	'楯楚楕椿楠楓椰楢楊榎樺榊榛槙槇槍槌樫槻樟樋橘樽橙檎檀櫂櫛櫓欣' +
	'欽歎此殆毅毘毬汀汝汐汲沌沓沫洸洲洵洛浩浬淵淳渚淀淋渥湘湊湛溢' +
	'滉溜漱漕漣澪濡瀕灘灸灼烏焚煌煤煉熙燕燎燦燭燿爾牒牟牡牽犀狼猪' +
	'獅玖珂珈珊珀玲琢琉瑛琥琶琵琳瑚瑞瑶瑳瓜瓢甥甫畠畢疋疏皐皓眸瞥' +
	'矩砦砥砧硯碓碗碩碧磐磯祇祢禰祐祷禄祿禎禽禾秦秤稀稔稟稜穣穰穹' +
	'穿窄窪窺竣竪竺竿笈笹笙笠筈筑箕箔篇篠簾籾粥粟糊紘紗紐絃紬絆絢' +
	'綺綜綴緋綾綸縞徽纂纏羚翔翠耀而耶耽聡肇肋肴胤胡脩腔脹膏臥舜舵' +
	'芥芹芭芙芦苑茄苔苺茅茉茸茜莞荻莫莉菅菫菖萄菩萌萠菱葦葵萱葺萩' +
	'董葡蓑蒔蒐蒼蒲蒙蓉蓮蔭蔦蓬蔓蕎蕨蕉蕃蕪薙蕾蕗藁薩蘇蘭蝦蝶螺蟹' +
	'衿袈袴裡裟裳襖訊訣註詢詫誼諏諄諒謂諺讃豹貰賑赳跨蹄蹟輔輯輿轟' +
	'辰辻迂迄辿迪迦這逞逗逢遥遙遁遼邑祁郁鄭酉醇醐醍釉釘釧銑鋒鋸錘' +
	'錐錆錫鍬鎧閃閏閤阿陀隈隼雀雁雛雫霞靖鞄鞍鞘鞠鞭頁頌頗颯饗馨馴' +
	'馳駕駿驍魁魯鮎鯉鯛鰯鱒鱗鳩鳶鳳鴨鴻鵜鵬鷲鷺鷹麒麟麿黎黛鼎巫渾';
	// 人名漢字第三・第四水準
	var jinmei_ex =
	'俱侮俠僧勉勤卑卽嘆器增墨寬層吞巢廊徵德悔憎懲揭摑擊敏晚暑曆朗' +
	'梅橫欄步歷每海涉淚渚渴溫漢瀨焰煮狀猪琢碑社祉祈祐祖祝神祥禍禎' +
	'福禱穀突節簞綠緖緣練繁繡署者臭萊著蔣薰虛虜蟬蠟視諸謁謹賓賴贈' +
	'逸郞都醬錄鍊難響顚類鷗黃黑瘦繫';
	var jinmei_cp932 = '增寬德朗橫瀨猪神祥福綠緖薰諸賴郞都黑';

	var daiiti =
	'乍什仇佼侠侭倶僑僻兇凋剃剥劃匙匝匪卦厭叛叩叱吃吊吋吠呆呑咋咳' +
	'唖嘘噛噸噺嚢坤垢埠塘填塵壷夙妓妾姐姑姦姶娼婁嬬嬰宍屍屠屡岨岱' +
	'庖廓廠廼弗弼彊怯悶愈慾戎扮捌掩掴掻揖摸撚撹擾斌杓杢柁栂栢栴桓' +
	'桝梱梼棉椙椴楳榔樗樵橡橿櫨欝歪洩涌涛涜淘渠溌漉潅澗澱濠瀞瀦烹' +
	'焔煽熔燐爺牌牝牢狐狗狛狸狽猷珪甑甜畦畷疹痔癌盈矧砺砿硲碇碍碕' +
	'禦禿稗穆穎穐竃笥筏箆箪箭篭簸粁粂粍粕糎糞糟糠綬緬繋繍罫翫翰聯' +
	'聾肱脆腿膿舘舛艮苅苓苧苫荊荏莱菟菰葎葱蒋蒜蔀蔚蕊蕩薮薯藷虻蚤' +
	'蛋蛎蛙蛤蛭蛸蛾蜘蝉蝋蝕蝿蟻袷覗詑誹諌諜謬讐賎贋赫趨躯轍轡迩逼' +
	'酋醗醤釆釦鈎鈷鉦鉾銚鋤鋪鋲錨鍍鍔鍾鎗鎚鏑鐙鐸鑓靭韮頚頬頴顛飴' +
	'餐駁騨髭鮒鮪鮫鮭鯖鯵鰍鰐鰭鰹鰻鱈鴇鴎鴛鴫鴬鵠鵡鹸麹黍鼠';
	return {jyoyo:jyoyo, jinmei:jinmei, daiiti:daiiti};
}
function start_check_moji_count(){
	var text = get_id('maintext').value;
	text = text.replace(/\r\n/g, "\n").replace(/\n+$/g, "");
	text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

	var text_lines = text.split('\n');

	var last = text_lines.length;
	var count = 0;
	var all = 0;
	var data = "";
	var part = 0;
	var pre = "";
	var leftpad = function(a, b){
		var x = "                  " + a;
		return x.substr(x.length - b);
	}
	var head = '■';
	var line;
	var c;
	var heads ="■◆●▲▼";
	for(var i = 0; i < last; i++){
		line = text_lines[i];
		c = line.charAt(0);
		if(c != ''){
			var index = heads.indexOf(c);
			if(-1 < index){
				head = heads.charAt(index);
				break;
			}
		}
	}
	for(var i = 0; i < last; i++){
		line = text_lines[i];
		c = line.charAt(0);
		if(c === head){
			if(0 < all){
				data += leftpad(count, 6) + "  ";
				all += count;
				if(10 <= count){
					part++;
				}
			}else{
				all = 1;
			}
			count = 0;
			data += pre + '\n';
			pre = line;
		}else{
			count += line.replace(/[　 \r\n\t]/g, "").length;
		}
	}
	data += leftpad(count, 6) + "  ";
	all += count;
	all -= 1;
	data += pre + '\n';
	data += "" + leftpad(all, 6) + "  合計\r";
	data += "平均    " + leftpad(part + 1, 4) + " * " + Math.floor(all/(part+1)) + "\n";
	data += "平均-1  " + leftpad(part, 4) + " * " + Math.floor(all/(part)) + "\n";
	data = '<pre>' + data + '<pre>';
	var text = data.replace(/\n/g, "<br>")
	get_id('result').innerHTML = '<div class="resultext">' + text + '</div>';
}
