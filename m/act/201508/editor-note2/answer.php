<?php
	/**
	 * 调查问卷
	 */
	if($_POST){
		if(strpos($_POST['answer5'], 'F')){
			$f = strstr($_POST['answer5'],':');
			$_POST['answer5'] = str_replace(",F$f","",$_POST['answer5']);
		}
		$answer = implode(';', $_POST);
		file_put_contents('answer_choose.txt', $answer.PHP_EOL, FILE_APPEND|LOCK_EX);
		file_put_contents('answer_write.txt', $f.PHP_EOL, FILE_APPEND|LOCK_EX);
	}
