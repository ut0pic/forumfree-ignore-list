/* TODO
 * 
 * ADD Ignore last post from ignored users in board view
 * ADD Ignore likes from ignored users
 */

// execute the script before page load
ignoreUsers("https://testf0rum.forumfree.it/?act=Msg&CODE=02", "TABLE", "quote_top");

/*
 */
async function ignoreUsers(url, postTag, quoteClass) {
    /* --- get the ignore list --- */
    const result = await fetch(url);
    // set timeout otherwise text() fails/hangs
    setTimeout(() => null, 0);
    const data = await result.text();
    // replace '\n' with ' ' (space) in html document, otherwise regex does not match
    var s = data.replace(/\n/g, " ");
    // regex to get the ignored
    usersToIgnoreString = s.match(/<textarea name=\"cannot_contact\" .*?>(.*?)<\/textarea>/)[1];
    // split the string at " " and put elements into an array
    users = usersToIgnoreString.split(" ");
    // last element is always empty, remove it
    users.splice(users.length-1, 1);
    /* --- end --- */
    
    /* --- ignore users from the list --- */
    // iterate for every user in the list
    for(i = 0; i < users.length; i++){
        var key = users[i];
        console.log("key = "+users[i]);
        /* --- remove user's posts from the page --- */
        var posts = document.getElementsByTagName(postTag);
        for(k = 0; k < posts.length; k++) {
            if(posts[k].innerHTML.includes(key+"</a>") )
                posts[k].style.display = "none";
        }
        /* --- end --- */
        /* --- remove user's quoted posts from the page --- */
        var quoteDivs = document.getElementsByClassName(quoteClass);
        for(k = 0; k < quoteDivs.length; k++){
            if(quoteDivs[k].innerHTML.includes(key+" @") ){
                // get parent element
                quotePost = quoteDivs[k].parentNode;
                console.log("*****PARENT*****"+quotePost.innerHTML);
                // hide quoted post
                quotePost.style.display = "none";
            }
        }
        /* --- end --- */
    }
    /* --- end --- */
}
