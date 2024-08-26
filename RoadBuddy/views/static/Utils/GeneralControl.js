import { messages } from "./AppClass.js";
import * as DOMElements from "./DOMElements.js";
import { UpdateFriends } from "./ManageFriend.js";
import { DeleteMessage } from "./ManageMessage.js";

export function InitializeAllPannelsTagAttributes(){
    const {availWidth} = GetUserScreenAvailSize();
    [DOMElements.mainPannel, DOMElements.trackingPannel, 
    DOMElements.friendPannel, DOMElements.teamPannel].forEach(pannel => {
        const isMainPannel = pannel === DOMElements.mainPannel;
        pannel.style.display = isMainPannel ? "block" : "none";
        if (pannel.getAttribute("class") === "main-pannel" ||
            pannel.getAttribute("class") === "tracking-pannel"){
            const feasibleSize = GetFeasibleRWDStyle(availWidth, pannel.getAttribute("class"));
            pannel.style.top = feasibleSize.dropDown.top;
            pannel.style.height = feasibleSize.dropDown.height;
        }
    })
}

export function isPannelPulledUp(pannelCSSSelector){
    let//   
        isPulledUp,
        pannel = document.querySelector(pannelCSSSelector),
        {availWidth} = GetUserScreenAvailSize(),
        feasibleSize = GetFeasibleRWDStyle(availWidth, pannel.getAttribute("class"));
    isPulledUp = pannel.style.top === feasibleSize.pullUp.top;
    return isPulledUp;
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
    const//
        pannel = document.querySelector(pannelCssSelector),
        {availWidth} = GetUserScreenAvailSize(),
        feasibleSize = GetFeasibleRWDStyle(availWidth, pannel.getAttribute("class")),
        isPulledUp = isPannelPulledUp(pannelCssSelector);
    pannel.style.top = (isPulledUp) ? feasibleSize.dropDown.top : feasibleSize.pullUp.top;
    pannel.style.height = (isPulledUp) ? feasibleSize.dropDown.height : feasibleSize.pullUp.height;
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
                friendOuter.style.height = "55%";
                break

            case "start":
                friendOuter.style.height = "55%";
                break

            case "join":
                friendTitle.style.display = "none";
                friendOuter.style.display = "none";
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
        btnsForTrackingPannel = [DOMElements.invite, DOMElements.leave];
    
    const onMainPannel = (DOMElements.mainPannel.style.display === "block");
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
            document.querySelector("div.configure-response")
            ],
        pannelsExceptMain = ["friend", "team", "message", "configure"],
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
        msgBoxContent.textContent = `來自 ${rest[0].friendName} 的好友邀請`;
        msgBox.style.display = display;
        return
    }

    if (msgCssSelector === ".friend-request" && display === "block") {
        let//
            msgBox = document.querySelector(msgCssSelector),
            msgBoxContent = document.querySelector(`${msgCssSelector} .content`),
            statement = `已發出交友申請`;

        // Not allowed if no one is selected
        if (rest[0].selectedFriendIDs.length === 0) { statement = `你尚未選擇對象` }

        // NOT allowed if they are already in friendship 
        // between sender and some of the selected guys
        if (rest[0].repetitionIDs.length !== 0) {
            let repeatIDString = "";
            for (let friend of rest[0].oldFriendsList) {
                if (rest[0].repetitionIDs.includes(friend.user_id)) {
                    repeatIDString += ` ${friend.username} `;
                }
            }
            statement = `你與${repeatIDString}已經是好友關係，請重新選擇對象`;
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
            msgBoxContent.textContent = (rest[0].accept) ? `${rest[0].receiverName} 接受你的好友邀請` : `${rest[0].rest[0].receiverName} 拒絕你的好友邀請`;
        }
        else{
            msgBoxContent.textContent = (rest[0].accept) ? `你與 ${rest[0].senderName} 已結為好友` : `你已拒絕 ${rest[0].senderName} 的好友邀請`;
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
                messageItem.textContent = "目前沒有交友申請";
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
                msgBoxContent.textContent = `來自 ${rest[0].leaderName} 的隊伍邀請`;
                msgBox.style.display = display;   
            }
            break

        case ".team-join-request":
            if(display === "block"){
                msgBoxContent.textContent = `來自 ${rest[0].applicantUsername} 的入隊申請`;
                msgBoxContent.setAttribute("id", rest[0].applicantID);
                msgBoxFrom.textContent = rest[0].applicantUsername;
                msgBoxFrom.setAttribute("id", rest[0].applicantSID);
                msgBox.style.display = display;
            }
            break

        case ".team-join-response":
            if(display === "block"){
                msgBoxContent.textContent = `隊伍${rest[0].teamName}，尚未啟程`;
                msgBox.style.display = display;
            }
            break

        case ".team-invite-response":    
            if(display === "block"){
            }
            break
        
        case ".team-create-response":    
            if(display === "block"){
                msgBoxContent.textContent = `你已建立隊伍 ${rest[0].teamName}`;
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
    isInputFilledIn: "(此欄位不可空白)",
    isInputValuesConsistent: "(與新密碼不一致)",
    isInputValueIncludingCharacters: "(格式錯誤，須包含@)",
    isInputValuesUnique: "(不可與舊密碼相同)"
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
        ClearErrorMessage(inputTitleElement);
        const messageDiv = document.createElement("div");
        messageDiv.textContent = message;
        messageDiv.style.color = "red";
        messageDiv.style.fontSize = "13px";
        messageDiv.style.lineHeight = "30px";
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
    if (display === "flex") {msgBoxContent.textContent = "是否跳過上傳照片？"}
    if (display === "none") {msgBoxContent.textContent = ""}
    msgBox.style.display = display;
}

export function GetUserScreenAvailSize(){
    return {
        availWidth: window.screen.availWidth, 
        availHeight: window.screen.availHeight
    }
}

export function GetFeasibleRWDStyle(userScreenWidth, pannelType){
    //main-pannel: 75+25 < 600px; 80+20 600-1200px; 70+30 >1200px
    //tracking-pannel: drop down - 70top + 30height / pull up - 50top + 50height
    const//
        RWDSize = {
            "main-pannel": {
                600: {
                    dropDown: {top: "75vh", height: "25vh"}, 
                    pullUp: {top: "25vh", height: "75vh"}},
                1200: {
                    dropDown: {top: "80vh", height: "20vh"}, 
                    pullUp: {top: "20vh", height: "80vh"}},
                1920: {
                    dropDown: {top: "70vh", height: "30vh"}, 
                    pullUp: {top: "30vh", height: "70vh"}} 
            },
            "tracking-pannel": {
                600: {
                    dropDown: {top: "80vh", height: "20vh"}, 
                    pullUp: {top: "50vh", height: "50vh"}}
            }
        },
        feasibleSize = {dropDown: null, pullUp: null};

    for (const widthLevel of Object.keys(RWDSize[pannelType])){
        if (userScreenWidth - widthLevel <= 0){
            feasibleSize.dropDown = RWDSize[pannelType][widthLevel].dropDown;
            feasibleSize.pullUp = RWDSize[pannelType][widthLevel].pullUp;
            break
        }
    }
    if (feasibleSize.dropDown === null){
        const largestAvailSize = Object.keys(RWDSize[pannelType])[Object.keys(RWDSize[pannelType]).length - 1];
        feasibleSize.dropDown = RWDSize[pannelType][largestAvailSize].dropDown;
        feasibleSize.pullUp = RWDSize[pannelType][largestAvailSize].pullUp; 
    }
    return feasibleSize
}