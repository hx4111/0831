<html>
	<head>
		<meta charset="UTF-8"/>
		<title>
		</title>
		<style type="text/css">#author-contract a {
	width: 45%;
	float: left;
	margin: 10px 0;
}

#author-contract em {
	    margin: 2px 5px;
    padding: 2px;
    font-style: initial;
    background: #2af;
    color: #fff;
    width: 30px;
    display: inline-block;
    text-align: center;
    height: 30px;
    line-height: 30px;
}</style>
	</head>
	<body>
	</body>
</html>
<?php
//生成地址
$num = 0;
function getURL($file) {
	global $num;
	$dir = opendir($file);
	echo "<div id='author-contract'>";
	while ($filename = readdir($dir)) {
		if ($filename != "." && $filename != ".." && $filename != ".DS_Store") {
			$filename = $file . "/" . $filename;
			if (is_dir($filename)) {
				getURL($filename);
				$num++;
			} else {
				$num++;
				echo '<a href="' . $filename . '"><em>' . $num . "</em>" . $filename . '</a>';
			}
		}
	};
	closedir($dir);
};
echo "</div>";
getURL('images');
?>