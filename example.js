/* useState function & class 차이 */

import { useState } from "react";

// Function
    const [item, setItem] = useState(1);
    const incrementItem = () => setItem(item+1);
// class
    state = {
        item: 1
    };
    incrementItem = () => {
        this.setState( state => { 
            return {
                item: state.item +1
            };
        });
    };


/* Promise (JavaScript) */
// 1. Producer
//    wen new Promise is created, the excuterr rruns automatically
function fecthUser(){
    return new Promise((resolve, reject) => {    
        // do some heavy work (file, network)
        console.log('Execute');
        setTimeout(() => {
            resolve('Finish');
            // reject(new Error('Finish_error'))
        }, 2000);
    });
}

// 2. Consumer: hen, catch, finally
promise
    .then((value) => {
        console.log(value) // 'Finish' 값 전달
    })
    .catch(error => {
        console.log(error);
    })
    .finally(() => {});


/* Async & Await */
// 1.Async
async function fecthUser() {
    // do network request in 10 
    return 'Finish';
}


/* useEffeect */
// useEffect는 component 실행하자마자 바로 실행
//             component refresh 되면 바로 실행

// class의 componentDidMount componentDidUpdate componentWillUnmount 역할

const sayHello = () => console.log('hello');
const [dep1, setDep1] = useState(0);
const [dep2, setDep2] = useState(0);

useEffect(sayHello, [])
// [dependency] 비어있으면 useEffect는 한번만 실행
// class의 componentDidMount 

useEffect(sayHello, [dep1])
// dep1 변경때마다 실행 (componentWillUpdate)

useEffect(() => {
    return (() => something);
}, [])
// return (componentWillUnmount)

// https://velog.io/@yhe228/React-NavigationTab-navigation
// useEffect는 보통 화면이 랜더링 된 후 실행된다.(화면이 완전히 바뀌고 난 후 발생)
// useLayoutEffect는 화면의 리사이징 즉, 레이아웃에 변화를 감지하는 Effect이다(화면이 바뀌기 전 발생)

// 1. Promise, Then
const getHen = () => 
    new Promise((resolve, reject) => {
        setTimeout(() =>resolve('hen'), 1000);
    });
    const getEgg = (hen) => 
    new Promise((resolve, reject) => {
        setTimeout(() =>resolve(new Error (`error! ${hen} => egg`), 1000);
    });
    const cook = (egg) => 
    new Promise((resolve, reject) => {
        setTimeout(() =>resolve(`${egg} => cook`), 1000);
    });

getHen() //
    .then(hen => getEgg(hen))
    .catchh(error => {
        return 'another';
    })
    .then(cook)
    .catch(console.log);

// 2. Async,Await

// Promise function
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getApple(){
    // delay가 끝날때까지 기다림
    // delay는 Promise를 return
    await delay(3000);
    throw 'error';
    return 'apple';
}

async function getBanan(){
    await delay(3000);
    return 'banana';
}

// 순차처리
async function pickFruits() {
    try{
        const apple = await getApple();
        const banana = await getBanana();
    } catch(error) {
        null;
    }
    return `${apple} + ${banana}`;
}



// 병렬처리 1
async function pickFruits() {
    try{        
        const applePromise = getApple(); // 즉시 실행
        const bananaPromise = getBanana(); // 즉시 실행
        const apple = await applePromise;
        const banana = await bananaPromise;
    } catch(error) {
        null;
    }
    return `${apple} + ${banana}`;
}
pickFruits().then(console.log);

// 병렬처리 2
async function pickFruits() {
    try{        
        const applePromise = getApple(); // 즉시 실행
        const bananaPromise = getBanana(); // 즉시 실행
        const apple = await applePromise;
        const banana = await bananaPromise;
    } catch(error) {
        null;
    }
    return `${apple} + ${banana}`;
}

function pickAllFruits() {
    return Promise.all([getApple(), getBanana()])
    .then(fruits => fruits.join(' + '));
}
pickAllFruits().then(console.log);

function pickOnlyOne() {
    return Promise.race([getApple(), getBanana()]);
}