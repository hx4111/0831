@echo off
browserify -t reactify %1 > %2
Pause