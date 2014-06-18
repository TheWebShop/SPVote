SPVote
======

Voting in SharePoint 2010 done with angularJS  
Depends: jQueryUI, ngResource
###Usage###

Your view/voteCtrl will contain any amount of:
```
<button role='button' ng-click="registerVote(UNQIUE-NUMBER, 'ITEM-NAME')" type="button">
```
The vote button(s) will call back to SP's list, either writing a new vote (if none exist) or update your
vote (if one exists).  
  
### TO DO ###
Lots. This was very quick and dirty implimentation.  
- Genericize the setting vote list
- Some kind of error handling(!)
- Better abstraction of user notifications
- Drop jQuery
