var data = {
	'1': {
		title: '能和陌生人比较迅速的熟络起来',
		yes: 5,
		no: 2
	},
	'2': {
		title: '享受独处',
		yes: 4,
		no: 5
	},
	'3': {
		title: '拥有很多装饰品',
		yes: 6,
		no: 9
	},
	'4': {
		title: '有很多时候会不自知的出口伤人',
		yes: 8,
		no: 10
	},
	'5': {
		title: '能迅速适应变化， 有眼力见',
		yes: 7,
		no: 3
	},
	'6': {
		title: '繁琐之事不愿为之',
		yes: 9,
		no: 11
	},
	'7': {
		title: '得到别人垂青总是心情大好',
		yes: 12,
		no: 15
	},
	'8': {
		title: '比起下雪更喜爱下雨',
		yes: 10,
		no: 13
	},
	'9': {
		title: '就在此时一瞬间能想到的朋友超过5个',
		yes: 12,
		no: 14
	},
	'10': {
		title: '比起可爱的更喜爱清爽简单的东西',
		yes: 16,
		no: 17
	},
	'11': {
		title: '认为爱情和性别无关',
		yes: 20,
		no: 13
	},
	'12': {
		title: '认为自己真的长的超漂亮or超帅气',
		yes: 15,
		no: 14
	},
	'13': {
		title: '现在想得到的东西中有包涵多多的空暇时间',
		yes: 19,
		no: 9
	},
	'14': {
		title: '认为爱上一个人的同时也得到了伤痛',
		yes: 21,
		no: 15
	},
	'15': {
		title: '对于喜爱的东西非常执着于得到',
		yes: 18,
		no: 20
	},
	'16': {
		title: '认为自己是个俗人',
		yes: 21,
		no: 23
	},
	'17': {
		title: '不清楚自己为什么选择当下正在做的事情',
		yes: 'C',
		no: 19
	},
	'18': {
		title: '对身边人的变化比较敏感',
		yes: 20,
		no: 21
	},
	'19': {
		title: '通常不知不觉会一个人微笑起来',
		yes: 'D',
		no: 30
	},
	'20': {
		title: '对于某些方面比自己好的人虽然会眼红但不会想着去破坏',
		yes: 25,
		no: 24
	},
	'21': {
		title: '常常没有任何缘由的也突然会觉得心里难受或者郁闷',
		yes: 23,
		no: 17
	},
	'22': {
		title: '可以抚慰我内心的人至少有两个',
		yes: 'F',
		no: 26
	},
	'23': {
		title: '事情没有解决之前总会烦心和郁闷',
		yes: 27,
		no: 25
	},
	'24': {
		title: '脾气火爆',
		yes: 28,
		no: 30
	},
	'25': {
		title: '有不为任何人所知的痛苦的过去',
		yes: 22,
		no: 29
	},
	'26': {
		title: '很难向别人敞开胸怀诉说真情',
		yes: 'E',
		no: 29
	},
	'27': {
		title: '喜爱收藏某种东西',
		yes: 'A',
		no: 24
	},
	'28': {
		title: '人生之路能这样一路走来觉得很满足',
		yes: 30,
		no: 'B'
	},
	'29': {
		title: '容易落泪',
		yes: 'D',
		no: 'C'
	},
	'30': {
		title: '相信命中注定',
		yes: 'C',
		no: 'A'
	}
}
var answer = {
	'A': {
		'img': 'a_img.jpg',
		'letters': 'A',
		'conclusion': '100%攻<br>完全强攻<br>总攻',
		'introduce': '这样的人都是总攻类型的~ 一般是帝王攻或者是十分强大的鬼畜攻！！！ 绝对不许别人忤逆也绝对不许别人动自己的人，尤其是恋人。做事都会做到近乎完美。',
		'opus': '未近',
		'role': '未几少爷',
		'opusDescribe': '污！这个人就是污！<br>说限制级的话<br>能够如呼吸般自然！<br>超腹黑的恶魔少爷<br>最爱玩弄小近逼他穿女装<br>还有恶趣味的惩罚',
		'ccid': '11643'
	},
	'B': {
		'img': 'b_img.jpg',
		'letters': 'B',
		'conclusion': '80%攻<br>普通强攻',
		'introduce': '一般多出军阀攻、将军攻、总裁攻。这类人的特点就是在强大之余还有些贱萌的地方。装逼的同时还会像受受微微透露一些弱气的部分，然而尽管如此他们还是很强的。',
		'opus': '邻家阳台',
		'role': '安子健',
		'opusDescribe': '为人开朗，偶尔喝酒<br>喜欢打篮球<br>数学学霸，其他成绩却一塌糊涂<br>毒舌爱爆粗爱吐槽<br>和苏原是邻居<br>霸道中却隐藏不住些许该死的温柔 ',
		'ccid': '11347'
	},
	'C': {
		'img': 'c_img.jpg',
		'letters': 'C',
		'conclusion': '40%攻<br>弱攻',
		'introduce': '这类的小攻都非常的柔和，属于温柔可爱的类型，当然其中也不乏少许痴汉，也有看似别扭高冷不好接触，实际是非常温柔和蔼的小天使。一般特别呵护受受，温柔的他们就连受受偶尔反攻也会接受哦。',
		'opus': '兄长掰弯计划',
		'role': '叶承',
		'opusDescribe': '孤僻冰冷的个性<br>有一个异父异母的哥哥叶芒<br>喜欢和哥哥吵嘴，喜欢损他<br>却一心只想独占<br>暗中阻止大胸妹接近哥哥<br>不喜欢别人靠得太近 ',
		'ccid': '11110'
	},
	'D': {
		'img': 'd_img.jpg',
		'letters': 'D',
		'conclusion': '40%受<br>花受',
		'introduce': '这个类型的受基本上都是腹黑或者高冷受、一边不承认自己喜欢攻方一边又没办法离开攻方。也有一些是看上去很美所以生生被攻掰成受的。',
		'opus': '白诡纪年',
		'role': '特勒瑞林',
		'opusDescribe': '为了保护诡精灵不惜空手接白刃<br>腹黑和高冷是本色<br>在哈诺的调戏下<br>表面看似不情愿<br>却欲拒还迎 ',
		'ccid': '701'
	},
	'E': {
		'img': 'e_img.jpg',
		'letters': 'E',
		'conclusion': '80%攻<br>弱受',
		'introduce': '这类的受受都是很温柔，一般都十分温顺听话。当然啦也会有少许傲娇属性。也有一部分属于诱受，主动去勾搭喜欢的小攻。',
		'opus': '送快递是件破事儿',
		'role': '邹小安',
		'opusDescribe': '俊俏柔弱的快递小哥<br>服务满分<br>有礼貌的乖乖男<br>和霸道总裁和亲密邂逅<br>在凌厉的攻势面前有点不习惯了呢',
		'ccid': '10962'
	},
	'F': {
		'img': 'f_img.jpg',
		'letters': 'F',
		'conclusion': '100%受<br>完全受<br>总受',
		'introduce': '这类型的多出天然呆宠物系。软软哒、萌萌哒、蠢蠢哒~ 总是让人忍不住去照顾。也有一些是稍微有点调皮捣蛋的。属于一旦恋爱了就完全离不开小攻照顾的类型。',
		'opus': '药不能乱吃',
		'role': '野仁',
		'opusDescribe': '表面像戴着眼镜的斯文败类<br>实则是一个才华横溢的作家<br>属于敢怒不敢言的类型<br>在助手叶晴的调教下<br>服服帖帖<br>毫无招架之力',
		'ccid': '11051'
	},

}