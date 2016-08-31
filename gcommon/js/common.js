// 分类颜色背景色
function getCategoryColorByID(categoryID, alpha) {
	if (categoryID == 10 || categoryID == 16 || categoryID == 21) {
		//		科幻 历史 动作
		var color = alpha ? 'rgba(56,164,214,' + alpha + ')' : '#2cafe6';
	} else if (categoryID == 11 || categoryID == 20 || categoryID == 22 || categoryID == 24) {
		//		恋爱 美食 耽美 情感
		var color = alpha ? 'rgba(255,91,152,' + alpha + ')' : '#ff5b98';
	} else if (categoryID == 12 || categoryID == 17 || categoryID == 19) {
		//		校园 冒险 体育
		var color = alpha ? 'rgba(72,204,141,' + alpha + ')' : '#48cc8d';
	} else if (categoryID == 13 || categoryID == 14 || categoryID == 28) {
		//		恐怖 悬疑 剧情
		var color = alpha ? 'rgba(168,117,237,' + alpha + ')' : '#a875ed';
	} else if (categoryID == 15 || categoryID == 18 || categoryID == 23) {
		//		搞笑 幻想 日常
		var color = alpha ? 'rgba(255,103,23,' + alpha + ')' : '#ff6717';
	} else if (categoryID >= 100 && categoryID < 200) {
		var color = alpha ? 'rgba(44,175,230,' + alpha + ')' : '#2cafe6';
	} else if (categoryID >= 200 && categoryID < 300) {
		var color = alpha ? 'rgba(255,91,152,' + alpha + ')' : '#ff5b98';
	} else if (categoryID >= 300 && categoryID < 400) {
		var color = alpha ? 'rgba(72,204,141,' + alpha + ')' : '#48cc8d';
	} else if (categoryID >= 400 && categoryID < 500) {
		var color = alpha ? 'rgba(255,103,23,' + alpha + ')' : '#ff6717';
	} else {
		var color = alpha ? 'rgba(168,117,237,' + alpha + ')' : '#a875ed';
	}
	return color;
}