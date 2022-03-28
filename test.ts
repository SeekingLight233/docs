// @ts-nocheck

function once(fn:Function){
  let done = false;
  return function(){
    if(!done){
      done = true;
      fn.apply(this, arguments);
    }
  }
}

const pay = once((args)=>{
  console.log('pay',args);
})

pay("1")
pay("2")
pay("3")