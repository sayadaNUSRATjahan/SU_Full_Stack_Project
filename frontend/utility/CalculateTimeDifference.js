function timeDiff(dateTimeString){
    const now=new Date();
    const past= new Date(dateTimeString);

    let timedDiff=Math.floor((now-past)/1000);
    const days=Math.floor(timedDiff/(60*60*24));

    timedDiff=timedDiff-days*60*60*24;

    const hours=Math.floor(timedDiff/(60*60));
    timedDiff=timedDiff-hours*60*60;

    const minutes=Math.floor(timedDiff/60);
    const seconds=timedDiff-minutes*60;

    let result="";

    //string concatenation ""+days
    if(days>0){
        result=result+`${days} days`;
    }
    else if(minutes>0){
        result=result+`${minutes} minutes`;
    }
    else if(hours>0){
        result=result+`${hours} hours`;
    }
    else
        result=result+`${seconds} seconds`;




   return result;

}
   
