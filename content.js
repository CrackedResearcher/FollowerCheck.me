chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "findFollowers") {
    console.log("reached find followers");
    let result1 = processInstagramDOM();
    sendResponse({ result: result1});
  }
});

function processInstagramDOM(){
    const parentDivs = document.querySelectorAll(".x1dm5mii.x16mil14.xiojian.x1yutycm.x1lliihq.x193iq5w.xh8yej3");
    
    let followerLinks = [];

    parentDivs.forEach(e => {
        let links = e.querySelector('a');
        if(links){
            let linnk = links.getAttribute('href');

            if(linnk){
                followerLinks.push(linnk.trim());
            }
        } 
    }
    );
    
    return followerLinks;
}
