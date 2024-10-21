import { messages } from "./AppClass.js";
import * as DOMElements from "./DOMElements.js";
import { UpdateFriends } from "./ManageFriend.js";
import { DeleteMessage } from "./ManageMessage.js";
import { ManipulateSessionStorage } from "./ManageUser.js";

export function InitializeAllPannelsTagAttributes(){
    const {availWidth} = GetUserScreenAvailSize();
    [DOMElements.mainPannel, DOMElements.trackingPannel, 
    DOMElements.friendPannel, DOMElements.teamPannel].forEach(pannel => {
        const isMainPannel = pannel === DOMElements.mainPannel;
        pannel.style.display = isMainPannel ? "block" : "none";
        if (pannel.getAttribute("class") === "main-pannel" ||
            pannel.getAttribute("class") === "tracking-pannel"){
            const feasiblePannelStyle = GetFeasiblePannelRWDStyle(availWidth, pannel.getAttribute("class"));
            pannel.style.height = feasiblePannelStyle.dropDown.height;
        }
    })
}

export function isPannelPulledUp(pannelCSSSelector){
    const//
        pannel = document.querySelector(pannelCSSSelector),
        {availWidth} = GetUserScreenAvailSize(),
        feasiblePannelStyle = GetFeasiblePannelRWDStyle(availWidth, pannel.getAttribute("class"));
    return pannel.style.height === feasiblePannelStyle.pullUp.height
}

export function onWhichPannelContent(){
    let //
        pannelAndContent,
        menuTitle = document.querySelector(".nav-menu-title").textContent,
        friendOption = document.querySelector(".nav-menu-friend").textContent,
        teamOption = document.querySelector(".nav-menu-team").textContent,
        mainPannelDisplay = document.querySelector(".main-pannel").style.display,
        trackingPannelDisplay = document.querySelector(".tracking-pannel").style.display;

    (menuTitle === friendOption && mainPannelDisplay === "block") && (pannelAndContent = {pannel: "main", content: "friend"});
    (menuTitle === teamOption && mainPannelDisplay === "block") && (pannelAndContent = {pannel: "main", content: "team"});
    (trackingPannelDisplay === "block") && (pannelAndContent = {pannel: "tracking", content: "partner"});
    return pannelAndContent
}

export function SwitchPannelOnAndOff(pannelCssSelector){
    ResizeHTMLBodyHeight();
    const//
        pannel = document.querySelector(pannelCssSelector),
        {availWidth} = GetUserScreenAvailSize(),
        feasiblePannelStyle = GetFeasiblePannelRWDStyle(availWidth, pannel.getAttribute("class")),
        isPulledUp = isPannelPulledUp(pannelCssSelector);
    pannel.style.height = (isPulledUp) ? feasiblePannelStyle.dropDown.height : feasiblePannelStyle.pullUp.height;
    if (pannelCssSelector === ".tracking-pannel"){
        document.querySelector(".tracking-pannel .partner-outer").style.height = 
        (isPulledUp) ? "35%" : "60%";
    }
}

export function SwitchMenuTitle(toWhichContent){
    const//
        menuTitle = document.querySelector(".nav-menu-title"),
        selectedContent = document.querySelector(`.nav-menu-${toWhichContent}`);
    menuTitle.textContent = selectedContent.textContent;

}

export function ShowPannelContent(pannelCssSelector, contentType, toShow, ...teamPannelInfo){ //SwitchPannelContent
    if (pannelCssSelector === ".main-pannel"){
        const elementsOnPannel = [
            ...document.querySelectorAll(`${pannelCssSelector} div[class$='intro']`),
            ...document.querySelectorAll(`${pannelCssSelector}  div[class$='outer']`)
        ];
        elementsOnPannel.forEach((element)=>{
            const contentTypeOfElement = element.getAttribute("class").split("-")[0];
            if (contentTypeOfElement === contentType) {
                element.style.display = (toShow) ? "flex" : "none";
                return
            }
            element.style.display = "none";        
        });
    }

    if (pannelCssSelector === ".team-pannel" || pannelCssSelector === ".friend-pannel"){
        const//
            pannel = document.querySelector(pannelCssSelector),
            pannelTitle = document.querySelector(".team-pannel .pannel-title"),
            search = document.querySelector(".team-pannel .search"),
            friendTitle = document.querySelector(".team-pannel .friend-title"),
            friendOuter = document.querySelector(".team-pannel .friend-outer"),
            btns = document.querySelectorAll(".team-pannel button");
        
        if (contentType !== "create" && contentType !== "invite"){
            pannelTitle.textContent = teamPannelInfo[0].pannelTitle;
            pannelTitle.setAttribute("id", teamPannelInfo[0].teamID);
        }
        pannelTitle.style.display = (contentType === "invite") ? "none" : "block";
        search.style.display = (contentType === "create") ? "flex" : "none";
        btns.forEach((btn)=>{
            const btnType = btn.getAttribute("class").split("-")[0];
            btn.style.display = (btnType === contentType) ? "block" : "none";
        })

        switch (contentType) {
            case "create":
                search.style.display = "flex";
                break;
                
            case "invite":
                pannel.style.height = "50vh";
                break

            case "start":
                break

            case "join":
                friendTitle.style.display = "none";
                friendOuter.style.display = "none";
                pannel.style.height = "20vh";
                pannel.style.width = "80%";
                pannel.style.left = "10%";
                break

            default:
                console.log(`Team pannel does not include contype of: ${contentType}`)
        }
    }
}

export function SwitchPullAndDropBtn(onWhichPannelCSSSelector){
    const//
        pullUpBtn = document.querySelector(onWhichPannelCSSSelector + " .pull-up"),
        dropDown = document.querySelector(onWhichPannelCSSSelector + " .drop-down"),
        pannel = document.querySelector(onWhichPannelCSSSelector),
        allPannelContents = [
            ...document.querySelectorAll("div[class$='intro']"), 
            ...document.querySelectorAll("div[class$='outer']")];
    const// 
        isPulledUp = isPannelPulledUp(onWhichPannelCSSSelector),
        pannelAndContent = onWhichPannelContent();

    pullUpBtn.style.display = (isPulledUp) ? "block" : "none";
    dropDown.style.display = (isPulledUp) ? "none" : "block";
}

export function SwitchSettingBtn(...manualSwitch){
    if (manualSwitch.length !== 0){
        const btnsCssSelectors = Object.keys(manualSwitch[0]);
        if (btnsCssSelectors.includes("all")){
            const// 
                allSettingBtns = [...document.querySelector(".setting").children],
                display = manualSwitch[0]["all"];

            allSettingBtns.forEach((btn)=>{
                if (btn.getAttribute("class") !== "setting-btn"){btn.style.display = display;}
            })
            return
        }
        for (let btnsCssSelector of btnsCssSelectors){
            const// 
                display = manualSwitch[0][btnsCssSelector],
                btn = document.querySelector(btnsCssSelector);
            btn.style.display = display;
        }
        return
    }

    const//
        btnsForMainPannel = [DOMElements.logout, DOMElements.message, DOMElements.config], 
        btnsForTrackingPannel = [DOMElements.invite, DOMElements.leave],
        btnsForBoth = [document.querySelector("div.mode")];
    
    const onMainPannel = (DOMElements.mainPannel.style.display === "block");

    // both pannels of main and tracking
    btnsForBoth.forEach((btn) => {btn.style.display = (btn.style.display !== "block") ? "block" : "none";});

    // on main pannel
    if (onMainPannel) {
        btnsForMainPannel.forEach((btn) => {btn.style.display = (btn.style.display !== "block") ? "block" : "none";});
        btnsForTrackingPannel.forEach((btn) => {btn.style.display = "none"});
        return
    }
    // on tracking pannel
    btnsForTrackingPannel.forEach((btn)=>{btn.style.display = (btn.style.display !== "block") ? "block" : "none";})
    btnsForMainPannel.forEach((btn) => {btn.style.display = "none"})
}



export function SwitchMenuToggle(){
    const//
        menuList = document.querySelector(".nav-menu-list"),
        isMenuListShown = document.querySelector(".nav-menu-list").style.display === "block";

    menuList.style.display = (isMenuListShown) ? "none" : "block";
    DOMElements.menu.style.border = (isMenuListShown) ? "none" : "0.5px solid rgb(151, 150, 150)";
}


export function SwitchPannel(toPannelType){
    const//
        pannelList = [
            ...document.querySelectorAll("div[class$='pannel']"),
            document.querySelector("div.configure-response"),
            document.querySelector("div.mode-prompt")
            ],
        pannelsExceptMain = ["friend", "team", "message", "configure", "mode"],
        showDisplayStyle = (pannelsExceptMain.includes(toPannelType)) ? "flex" : "block";
    pannelList.forEach((pannel)=>{
        const typeOfPannel = pannel.getAttribute("class").split("-")[0];
        if (typeOfPannel === toPannelType){pannel.style.display = showDisplayStyle}
        else{pannel.style.display = "none"}
    })
}

export function ControlFriendMsgBox(msgCssSelector, display, ...rest) {
    if (display === "none") {
        let//
            msgBox = document.querySelector(msgCssSelector),
            msgBoxContent = document.querySelector(`${msgCssSelector} .content`);

        msgBoxContent.textContent = "";
        msgBox.style.display = display;
        return
    }

    if (msgCssSelector === ".friend-prompt" && display === "block") {
        let//
            msgBox = document.querySelector(msgCssSelector),
            msgBoxContent = document.querySelector(`${msgCssSelector} .content`);
        msgBoxContent.setAttribute("id", rest[0].userID);
        msgBoxContent.textContent = `Friend-making invitation from ${rest[0].username}.`;
        msgBox.style.display = display;
        return
    }

    if (msgCssSelector === ".friend-request" && display === "block") {
        let//
            msgBox = document.querySelector(msgCssSelector),
            msgBoxContent = document.querySelector(`${msgCssSelector} .content`),
            statement = `Invitation sent.`;

        // Not allowed if no one is selected
        if (rest[0].selectedFriendIDs.length === 0) { statement = `Nobody is selected.` }

        // NOT allowed if they are already in friendship 
        // between sender and some of the selected guys
        if (rest[0].repetitionIDs.length !== 0) {
            let repeatIDString = "";
            for (let friend of rest[0].oldFriendsList) {
                if (rest[0].repetitionIDs.includes(friend.user_id)) {
                    repeatIDString += ` ${friend.username} `;
                }
            }
            statement = `You have made friends with ${repeatIDString} already.`;
        }

        msgBoxContent.textContent = statement;
        msgBox.style.display = display;
        return
    }

    if (msgCssSelector === ".friend-response" && display === "block") {
        let//
            msgBox = document.querySelector(msgCssSelector),
            msgBoxContent = document.querySelector(`${msgCssSelector} .content`),
            isSender = Number(window.sessionStorage.getItem("user_id")) === Number(rest[0].senderID);

        if (isSender) {
            msgBoxContent.textContent = (rest[0].accept) ? `${rest[0].receiverName} is added in your friend list.` : `${rest[0].rest[0].receiverName} rejected your friend-making invitation`;
        }
        else{
            msgBoxContent.textContent = (rest[0].accept) ? `${rest[0].senderName} is added in your friend list.` : `You've rejected the invitation from ${rest[0].senderName}.`;
        }

        msgBox.style.display = "block";
        return
    }
}

export function ClearList(cssSelector) {
    const list = document.querySelector(cssSelector); //".main-pannel .create-list"
    while (list.hasChildNodes()) {
        list.removeChild(list.lastChild);
    }
}

export function RenderList(listCssSelector, listItemArray) {
    switch(listCssSelector){
        case ".create-list":
        case ".join-list":
            const list = document.querySelector(listCssSelector); 
            for (let item of listItemArray) {
                const team = document.createElement("div");
                team.setAttribute("class", "item");
                team.setAttribute("id", item.team_id);
                team.textContent = item.team_name;
                list.appendChild(team);
            }
            break
        
        case ".main-pannel .friend-list":
            // Load friend list in main pannel
            for (let item of listItemArray) {
                const friend = document.createElement("div");
                friend.setAttribute("class", "item");
                friend.setAttribute("id", item["user_id"]);
                friend.textContent = item.username;
                DOMElements.mainPannelFriendList.appendChild(friend);
            }
            break
        
        case ".team-pannel .friend-list":
            // Load friend list in team pannel
            for (let item of listItemArray) {
                const//
                    friend = document.createElement("div"),
                    input = document.createElement("input"),
                    label = document.createElement("label");

                friend.setAttribute("class", "item");
                friend.setAttribute("id", item.user_id);
                input.setAttribute("type", "checkbox");
                input.setAttribute("id", item.user_id);
                input.setAttribute("name", item.username);
                label.setAttribute("for", item.username);
                label.textContent = item.username;

                friend.appendChild(input);
                friend.appendChild(label);
                friend.style.display = "none"; //switch to block when friend is online
                DOMElements.teamPannelFriendList.appendChild(friend);
            }
            break
        
        case ".message-list":
            const messageList = document.querySelector(listCssSelector);
            if (listItemArray.length === 0) {
                const messageItem = document.createElement("div");
                messageItem.setAttribute("class", "item");
                messageItem.textContent = "No messages";
                messageList.appendChild(messageItem);
                return
            }
            for (let item of listItemArray) {
                const//
                    messageItem = document.createElement("div"),
                    usernameDiv = document.createElement("div"),
                    btnOuter = document.createElement("div"),
                    acceptBtn = document.createElement("div"),
                    rejectBtn = document.createElement("div");

                messageItem.setAttribute("class", "item");
                messageItem.setAttribute("id", item.senderID);
                usernameDiv.setAttribute("class", "username");
                usernameDiv.textContent = item.senderName;
                btnOuter.setAttribute("class", "btn-outer");
                acceptBtn.setAttribute("class", "accept-btn");
                rejectBtn.setAttribute("class", "reject-btn");
                
                btnOuter.append(acceptBtn, rejectBtn)
                messageItem.append(usernameDiv, btnOuter);
                messageList.appendChild(messageItem);
                acceptBtn.addEventListener("click", function(){
                    const//
                        {user_id, username} = window.sessionStorage,
                        senderID = Number(this.parentElement.parentElement.getAttribute("id")),
                        senerName = messages.FindSenderName(senderID);
                    UpdateFriends(Number(user_id), {
                        senderID: senderID,
                        senderName: senerName,
                        receiverID: Number(user_id),
                        receiverName: username
                    });
                    messages.DeleteInfo(senderID);
                    ReRenderList([".message-list"], messages.GetSenderList());
                    DeleteMessage(senderID,Number(user_id));
                });
                rejectBtn.addEventListener("click", function(){
                    const// 
                        senderID = Number(this.parentElement.parentElement.getAttribute("id")),
                        {user_id} = window.sessionStorage;
                    DeleteMessage(senderID, Number(user_id))
                        .then(()=>{
                            messages.DeleteInfo(senderID);
                            ReRenderList([".message-list"], messages.GetSenderList());
                        })
                })
            }
            break
    }
}

export function ReRenderList(listCssSelectorArray, listItemArray){
    listCssSelectorArray.forEach((listCssSelector) =>{
        ClearList(listCssSelector);
        RenderList(listCssSelector, listItemArray);
    })
}

export function RenderOnlineStatus(itemCssSelector, onlineItemArray) {
    let// 
        items = document.querySelectorAll(itemCssSelector), //".main-pannel .friend-list .item"
        onlineStyle = { backgroundColor: "rgb(182, 232, 176)", border: "solid 3px rgb(22, 166, 6)" },
        offlineStyle = { backgroundColor: "rgb(235, 234, 234)", border: "solid 3px rgb(182, 181, 181)" };

    if (itemCssSelector === ".main-pannel .friend-list .item" ||
        itemCssSelector === ".join-list .item") 
    {   
        for (let item of items) {
            const itemIsOnline = (itemCssSelector === ".main-pannel .friend-list .item") ?
                                onlineItemArray.includes(item.getAttribute("id") * 1) :
                                onlineItemArray.includes(item.getAttribute("id")) ;
            if (itemIsOnline) {
                item.style.backgroundColor = onlineStyle.backgroundColor;
                item.style.border = onlineStyle.border;
                continue;
            }

            item.style.backgroundColor = offlineStyle.backgroundColor;
            item.style.border = offlineStyle.border;
        }
        return
    }

    if (itemCssSelector === ".team-pannel .friend-list .item") {
        for (let item of items) {
            const friendIsOnline = onlineItemArray.includes(item.getAttribute("id") * 1);
            if (friendIsOnline) {
                item.style.display = "flex";
                continue;
            }
            item.style.display = "none";
        }
        return
    }

}


export function ControlTeamMsgBox(msgCssSelector, display, ...rest) {
    let//
        msgBox = document.querySelector(msgCssSelector),
        msgBoxContent = document.querySelector(`${msgCssSelector} .content`),
        msgBoxFrom = document.querySelector(`${msgCssSelector} .from`);

    if (display === "none") {
        msgBoxContent.textContent = "";
        msgBoxContent.setAttribute("id","")
        msgBox.style.display = display;
        if (msgBoxFrom !== null){
            msgBoxFrom.textContent = "";
            msgBoxFrom.setAttribute("id", "");
        }
        return
    }

    switch(msgCssSelector){
        case ".team-invite-prompt":
            if(display === "block"){
                msgBoxContent.textContent = `Travel invitation from ${rest[0].leaderName}`;
                msgBoxContent.setAttribute("id", rest[0].teamID);
                msgBox.style.display = display;   
            }
            break

        case ".team-join-request":
            if(display === "block"){
                msgBoxContent.textContent = `Joining application from ${rest[0].applicantUsername}`;
                msgBoxContent.setAttribute("id", rest[0].applicantID);
                msgBoxFrom.textContent = rest[0].applicantUsername;
                msgBoxFrom.setAttribute("id", rest[0].applicantSID);
                msgBox.style.display = display;
            }
            break

        case ".team-join-response":
            if(display === "block"){
                msgBoxContent.textContent = `Team ${rest[0].teamName} is offline.`;
                msgBox.style.display = display;
            }
            break

        case ".team-invite-response":    
            if(display === "block"){
            }
            break
        
        case ".team-create-response":    
            if(display === "block"){
                msgBoxContent.textContent = `${rest[0].teamName} is created.`;
                msgBox.style.display = display;
            }
            break
    }
}

export function SwitchBetweenSignupAndLogin(){
    const//
        signupForm = document.querySelector("div.signup"),
        loginForm = document.querySelector("div.login"),
        isOnSignupForm = loginForm.style.display !== "flex";
    signupForm.style.display = (isOnSignupForm) ? "none" : "flex";
    loginForm.style.display = (isOnSignupForm) ? "flex" : "none";
}

export function SwitchSignUpStep(){
    const//
        btns = document.querySelectorAll("div.signup button"),
        formDivs = document.querySelectorAll("div.signup div.form-div"),
        isOnFillingUserInfo = document.querySelector("div.form-div.avatar").style.display !== "flex";
    if (isOnFillingUserInfo){
        btns.forEach((btn) =>{
            const isNextBtn = btn.getAttribute("class") === "next";
            btn.style.display = (isNextBtn) ? "none" : "block";
        })
        formDivs.forEach((div) => {
            const isAvatarForm = div.getAttribute("class").includes("avatar");
            div.style.display = (!isAvatarForm) ? "none" : "flex";
        })}
    if (!isOnFillingUserInfo){
        btns.forEach((btn) =>{
            const isNextBtn = btn.getAttribute("class") === "next";
            btn.style.display = (isNextBtn) ? "block" : "none";
        })
        formDivs.forEach((div) => {
            const isAvatarForm = div.getAttribute("class").includes("avatar");
            div.style.display = (!isAvatarForm) ? "block" : "none";
        })}
}

export const inputErrorMessages = {
    isInputFilledIn: "(The value cann't be blank)",
    isInputValuesConsistent: "(The value isn't consistent with new password)",
    isInputValueIncludingCharacters: "(The value is in wrong format)",
    isInputValuesUnique: "(The value must be different from old password)"
}

export function isInputErrorRepeating(inputTitleElement, message){
    const inputTitleChildElements = Array.from(inputTitleElement.children);
    let isRepeating = false;
    inputTitleChildElements.forEach((childElement) => {
        if (childElement.textContent === message) {isRepeating = true}
    })
    return isRepeating
}

export function RenderErrorMessage(inputTitleElement, message){
    if (!isInputErrorRepeating(inputTitleElement, message)){
        const//
            {availWidth} = GetUserScreenAvailSize(),
            {fontSize} = GetFeasibleFontStyle(availWidth);
        ClearErrorMessage(inputTitleElement);
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.style.color = "red"; 
        messageDiv.style.fontSize = fontSize;
        messageDiv.style.marginLeft = "10px";
        inputTitleElement.appendChild(messageDiv);
        inputTitleElement.nextElementSibling.style.border = "2px solid rgb(255, 197, 197)";
    }
}

export function ClearErrorMessage(...inputTitleElements){
    inputTitleElements.forEach(inputTitleElement => {
        while ( inputTitleElement.childElementCount >= 2 ) {
            inputTitleElement.removeChild(inputTitleElement.lastChild)
        }
        inputTitleElement.nextElementSibling.style.border = "none";
    })
}

export function isInputFilledIn(inputElementToBeExamined, ...rest){
    return inputElementToBeExamined.value !== "" 
}

export function isInputValuesConsistent(inputElementToBeExamined, ...inputElementsAsReferece){
    let allValuesConsistent = true;
    inputElementsAsReferece.flat().forEach((inputElement)=>{
        if (inputElement.value !== inputElementToBeExamined.value){
            allValuesConsistent = false;
            return
        }
    })
    return allValuesConsistent
}

export function isInputValuesUnique(inputElementToBeExamined, ...inputElementsAsReferece){
    let allValuesUnique = true;
    inputElementsAsReferece.flat().forEach(inputElement => {
        if(inputElement.value === inputElementToBeExamined.value){
            allValuesUnique = false;
            return
        }
    })
    return allValuesUnique
}

export function isInputValueIncludingCharacters(inputElementToBeExamined, ...characters){
    let examinationPass = true;
    characters.flat().forEach((character) => {
        if (!inputElementToBeExamined.value.includes(character)){
            examinationPass = false;
            return
        }
    })
    return examinationPass
}

export function VerifyInputValue(inputElementToBeExamined, inputExaminationCallback, ...examinationParameters){
    const examinationPass = inputExaminationCallback(inputElementToBeExamined, examinationParameters);
    if (examinationPass){ClearErrorMessage(inputElementToBeExamined.previousElementSibling)}
    else{RenderErrorMessage(inputElementToBeExamined.previousElementSibling, inputErrorMessages[inputExaminationCallback.name])}
    return {pass: examinationPass}
}

export function isEmailInputPass(emailInputElement){
    const isValueEligible = true &
        VerifyInputValue(emailInputElement, isInputFilledIn).pass &
        VerifyInputValue(emailInputElement, isInputValueIncludingCharacters, "@").pass;
    return isValueEligible
}

export function isUsernameInputPass(usernameInputElement){
    const isValueEligible = true & VerifyInputValue(usernameInputElement, isInputFilledIn).pass;
    return isValueEligible
}

export function isPasswordInputPass(passwordInputElement, confirmPasswordInputElement){
    const isValueEligible = true & 
        VerifyInputValue(passwordInputElement, isInputFilledIn).pass &
        VerifyInputValue(confirmPasswordInputElement, isInputFilledIn).pass &
        VerifyInputValue(confirmPasswordInputElement, isInputValuesConsistent, passwordInputElement).pass
    return isValueEligible
}

export function ControlMebmerMsgBox(msgCssSelector, display) {
    const//
        msgBox = document.querySelector(msgCssSelector),
        msgBoxContent = document.querySelector(`${msgCssSelector} div.content`);
    if (display === "flex") {msgBoxContent.textContent = "Are you sure to pass avatar uploading？"}
    if (display === "none") {msgBoxContent.textContent = ""}
    msgBox.style.display = display;
}

export function GetUserScreenAvailSize(){
    return {
        availWidth: window.screen.availWidth, 
        availHeight: window.screen.availHeight
    }
}

export function GetUserWindowInnerSize(){
    return {
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
    }
}

export const pannelRWDStyle = {
    "main-pannel": {
        600: {
            dropDown: {top: "75vh", height: "180px"}, //dropDown: {top: "75vh", height: "25vh"}, 
            pullUp: {top: "25vh", height: "550px"}}, //pullUp: {top: "25vh", height: "75vh"}},
        1200: {
            dropDown: {top: "70vh", height: "220px"}, //dropDown: {top: "75vh", height: "25vh"}, 
            pullUp: {top: "30vh", height: "700px"}}, //pullUp: {top: "25vh", height: "75vh"}},
        1920: {
            dropDown: {top: "70vh", height: "220px"},  //{top: "70vh", height: "30vh"}
            pullUp: {top: "20vh", height: "550px"}}  //pullUp: {top: "30vh", height: "70vh"}} 
    },
    "tracking-pannel": {
        600: {
            dropDown: {top: "75vh", height: "25vh"}, 
            pullUp: {top: "40vh", height: "60vh"}}
    }
};

export function GetFeasiblePannelRWDStyle(userScreenWidth, pannelType, pannelRWDStyleReference = pannelRWDStyle){
    const feasiblePannelStyle = {dropDown: null, pullUp: null};
    for (const widthLevel of Object.keys(pannelRWDStyleReference[pannelType])){
        if (userScreenWidth - widthLevel <= 0){
            feasiblePannelStyle.dropDown = pannelRWDStyleReference[pannelType][widthLevel].dropDown;
            feasiblePannelStyle.pullUp = pannelRWDStyleReference[pannelType][widthLevel].pullUp;
            break
        }
    }
    if (feasiblePannelStyle.dropDown === null){
        const largestAvailSize = Object.keys(pannelRWDStyleReference[pannelType])[Object.keys(pannelRWDStyleReference[pannelType]).length - 1];
        feasiblePannelStyle.dropDown = pannelRWDStyleReference[pannelType][largestAvailSize].dropDown;
        feasiblePannelStyle.pullUp = pannelRWDStyleReference[pannelType][largestAvailSize].pullUp; 
    }
    return feasiblePannelStyle
}

export const responseCatalogue = {
    ".configure-response": {
        0: {title: "Fail", img_src: "../static/images/error.gif"},
        1: {title: "Success", img_src: "../static/images/check.gif"},
        2: {title: "Updating", img_src: "../static/images/loading.gif"},
        3: {title: "Nothing needs to be updated", img_src: "../static/images/error.gif"},
        4: {title: "Old password is incorrect", img_src: "../static/images/error.gif"}
    },
    ".member-response": {
        0: {title: "", img_src: ""},
        1: {title: "Signing up", img_src: "../static/images/loading.gif"},
        2: {title: "Done", img_src: "../static/images/check.gif"},
        3: {title: "Verifying", img_src: "../static/images/loading.gif"},
        4: {title: "Server failure", img_src: "../static/images/error.gif"}
    }
};

export function RenderResponse(responseCssSelector, responseCode, reset = false){
    const//
        responseTitle = document.querySelector(`${responseCssSelector} p`),
        img = document.querySelector(`${responseCssSelector} img`);

    // document.querySelector(".configure-pannel").style.display = "none";
    document.querySelector(responseCssSelector).style.display = reset ? "none" : "flex";
    responseTitle.textContent = responseCatalogue[responseCssSelector][responseCode].title;
    img.src = responseCatalogue[responseCssSelector][responseCode].img_src;
}

export const fontRWDStyle = {
    500: {fontSize: "13px"},
    1200: {fontSize: "20px"},
    1920: {fontSize: "13px"}
};

export function GetFeasibleFontStyle(userScreenWidth, fontFeasibleStyleReference = fontRWDStyle){
    const feasibleFontStyle = {fontSize: null};
    for (const widthLevel of Object.keys(fontFeasibleStyleReference)){
        if (userScreenWidth - widthLevel <= 0){
            feasibleFontStyle.fontSize = fontFeasibleStyleReference[widthLevel].fontSize;
            break
        }
    }
    if (feasibleFontStyle.fontSize === null){
        const largestAvailSize = Object.keys(fontFeasibleStyleReference)[Object.keys(fontFeasibleStyleReference).length - 1];
        feasibleFontStyle.fontSize = fontFeasibleStyleReference[largestAvailSize].fontSize;
    }
    return feasibleFontStyle
};

export function ResizeHTMLBodyHeight(){
    const {innerHeight} = GetUserWindowInnerSize();
    document.body.style.height = `${innerHeight}px`;
}

export function GetUserInitialPosition(){
    try{
        const options = {maximumAge: 0};
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(
                (position) => {
                    const {latitude, longitude} = position.coords;
                    ManipulateSessionStorage("set", {initialLatitude: latitude, initialLongitude: longitude});
                },
                (error)=>{console.log(error)},
                options
            ); 
        }  
    }
    catch(error){console.log("Fail to execute GetUserInitialPosition: ", error)}
}

export function RenderTrackingMode(...specifiedMode){ //specifiedMode = [mode]
    const//
        modeCheckbox = document.querySelector("input#mode"),
        isRealtimeMode = modeCheckbox.checked || specifiedMode[0] === "realtime",
        [randomOption, realtimeOption] = document.querySelectorAll("div.mode-prompt__switch-outer p.option");
    randomOption.style.backgroundColor = (isRealtimeMode) ? "#ccc" : "#2196F3";
    realtimeOption.style.backgroundColor = (isRealtimeMode) ? "#2196F3" : "#ccc";
    modeCheckbox.checked = (isRealtimeMode) ? true : false;
}

export function GetSelectedUsersFromPannel(pannelCssSelector){
    const//
        allCheckboxesOnPannel = document.querySelectorAll(`${pannelCssSelector} input[type=checkbox]`),
        selectedUsersArray = []; //[{id:XXX, name:XXX}, {}, {}.....]
    for (const checkbox of allCheckboxesOnPannel) {
        if (checkbox.checked) {
            selectedUsersArray.push({
                id: Number(checkbox.getAttribute("id")), 
                name: checkbox.getAttribute("name")
            })
        }
    }
    return selectedUsersArray
}