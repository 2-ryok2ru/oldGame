const caution = document.getElementById("Caution");
// 最初に生成される石の処理
window.addEventListener('DOMContentLoaded', ()=>{
  const earlyStones = document.getElementById('svgRange');
  // すべての要素(石,コマ)の生成
  for(let j=0; j<=34; j++){
    let earlyPos = convertPosInfo(j);
    //初期生成する石の情報を設定
    const earlyAddCircle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    earlyAddCircle.classList.add("addC");
    earlyAddCircle.classList.add("childStone");
    earlyAddCircle.setAttribute('cx',earlyPos[0]);
    earlyAddCircle.setAttribute('cy',earlyPos[1]);
    earlyAddCircle.setAttribute('r',13);
    earlyStones.appendChild(earlyAddCircle);
    if(j===25 || j===29){ // 三角と四角の隙間部分の表示しない要素の完全非表示化
      earlyAddCircle.classList.replace("childStone","alysHidden");
    }
    // 初期配置場所以外の要素の一時非表示化
    if(!(earlyPos[0]===50 || earlyPos[0]===250 || earlyPos[1]===50 || earlyPos[1]===250) && !(earlyPos[0]===150 && earlyPos[1]===150) || j>=25){
      earlyAddCircle.classList.replace("childStone","hiddenC");
    }
    if(j===12){
      earlyAddCircle.classList.replace("childStone","parentStone");
      earlyAddCircle.setAttribute('r',18);
    }
  }
});


// クリックした場合の要素の表示、非表示の切り替え処理
window.addEventListener('load',function(){
  let addCnode = document.getElementsByClassName('addC');
  let eventKey=0; //特定のclassに対するクリック回数の記録
  let slctPos = null; //一回目のクリック時の要素番号の記録
  whoseTurn(eventKey); 
  for(let e=addCnode.length-1; e>=0; e--){
    // クリック時の処理対象の場合分け
    addCnode[e].addEventListener('click', function(){
      if(addCnode[e].classList.contains('parentStone')==true && eventKey===0){ // 1回目に親石がクリックされた時の処理
        addCnode[e].classList.replace('hiddenC','parentStone');
        slctPos = e;
      }else if(addCnode[e].classList.contains('childStone')==true && eventKey===1){ // 1回目に子石がクリックされた時の処理
        slctPos = e;
      }else if(addCnode[e].classList.contains('hiddenC')==true){ // 1回目クリックした要素の非表示、2回目クリックした要素の表示の処理
        if(movable(slctPos,e)){
          // 前回選択した時の要素が親石の場合と子石の場合で実行する処理の変更
          if(addCnode[slctPos].classList.contains('childStone')===true){ //2回目クリック時、1回目クリックが子
            addCnode[slctPos].classList.replace('childStone','hiddenC');
            addCnode[e].classList.replace('hiddenC','childStone');
            eventKey=0;
          }else if(addCnode[slctPos].classList.contains('parentStone')===true){ //2回目クリック時、1回目クリックが親
            addCnode[slctPos].classList.replace('parentStone','hiddenC');
            addCnode[slctPos].setAttribute('r',13);
            addCnode[e].setAttribute('r',18);
            addCnode[e].classList.replace('hiddenC','parentStone');
            beTaken(addCnode,e,slctPos);
            eventKey=1;
          }
        }
      }else {
        if(addCnode[slctPos]===undefined && eventKey===0){
          caution.innerText = "一番最初は親の番からだよ!";
        }else if(addCnode[slctPos].classList.contains('childStone')===true){
          caution.innerText = "2回目は既に置かれていないところをクリックしてね!";
        }else if(addCnode[slctPos].classList.contains('parentStone')===true){
          caution.innerText = "2回目は既に置かれていないところをクリックしてね!";
        }else if(!(addCnode[slctPos]===undefined) && eventKey===1){
          caution.innerText = "今は子の番なので子を選択して動かしてね!";
        }else if(!(addCnode[slctPos]===undefined) && eventKey===1){
          caution.innerText = "今は親の番なので親を選択して動かしてね!";
        }else{
          caution.innerText = "不具合が発生しました。";
        }
      }
      whoseTurn(eventKey); 
    })
  }
});


// 盤上の交点の判別番号を入力したとき、配列で座標を返す関数
function convertPosInfo (stoneNumber){
    let cxStone = null;
    let cyStone = null;
    let stonesPos = [];
    cxStone = (Math.floor(stoneNumber%5)+1)*50;
    cyStone = (Math.floor(stoneNumber/5)+1)*50; 
    stonesPos.push(cxStone,cyStone);
    return stonesPos;
};

//移動制限のための関数
function movable(slctPos,e){
  //四角形と三角形の接点部分を経由する移動以外の四角形と三角形の移動の制限
  if(e===26 || e===28 || slctPos===26 || slctPos===28){
    if((e<25 || slctPos<25) === !(e===22 || slctPos===22)){
      console.log("その移動は制限されています1");
      eventKey = 0;
      return;
    }
  }
  // ライン上での移動ではない斜め移動の制限
  let movablePos = [4,6];
  if(e % 2 !== 0 && movablePos.some(element => (slctPos+element === e) || (slctPos-element === e)) === true){
    console.log("その移動は制限されています2");
    return;
  }
  
  // 行の区切りを超える移動の制限
  movablePos.push(1); //配列を[1,4,6]にする
  for(let m=0; m<=2; m++){
    if(slctPos%5===0){
      if(movablePos[m]===4 && slctPos+movablePos[m]===e){
        console.log("m"+m+"  その移動は制限されています2");
        return;
      }else if((movablePos[m]===1 || movablePos[m]===6) && slctPos-movablePos[m]===e){
        console.log("m"+m+"  その移動は制限されています3");
        return;
      }
    }else if(slctPos%5===4){
      if(movablePos[m]===4 && slctPos-movablePos[m]===e){
        console.log("m"+m+"  その移動は制限されています4");
        return;
      }else if((movablePos[m]===1 || movablePos[m]===6) && slctPos+movablePos[m]===e){
        console.log("m"+m+"  その移動は制限されています5");
        return;
      }
    }
  }
  
  // 前後左右斜め以外の移動の制限
  movablePos.push(5); //配列を[1,4,5,6]にする
  let rangeBound = movablePos.some(element => (slctPos+element === e) || (slctPos-element === e));
  return rangeBound;
};

// 親が移動した時に移動先が子と子の間に挟まるような位置の場合、その両側の子の非表示処理をするための関数
function beTaken(addCnode,e,slctPos){
  let takenStone =[1,5,4,6]
  for(let d=0; d<=3; d++){
    let lAndU = e-takenStone[d];
    let rAndD = e+takenStone[d];
    if(lAndU<0 || rAndD<0 || lAndU>34 || rAndD>34)continue; // lAndU,rAndDがマイナスか35以上になる場合にスキップ
    // 親を挟んで対になって存在する子の非表示化
    if((addCnode[lAndU].classList.contains('childStone') === true)&& (addCnode[rAndD].classList.contains('childStone') === true)){
      if(e%2!==0 && (takenStone[d]===4 || takenStone[d]===6))continue;
      console.log(takenStone[d] +"  "+ e)
      if((e%5===0 || e%5===4) && !(takenStone[d]===5)){
        return;
      }
      addCnode[lAndU].classList.replace("childStone","hiddenC");
      addCnode[rAndD].classList.replace("childStone","hiddenC");
    }
  }
};

// 親と子どちらの番かの表示
const yourTurn = document.getElementById('your_turn');
function whoseTurn(eventKey){
  if(eventKey===1){
    yourTurn.innerText = '現在は子の番です!';
  }else if(eventKey===0){
    yourTurn.innerText = '現在は親の番です!';
  }
};
