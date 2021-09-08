const API_KEY = "a8966a715ef54aa0abd46ee32f13d09ecfaa96c31c94a8a11c267af9bf679286"; 

const AGGREGATE_INDEX = "5";

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`
);

const tickersHandlers = new Map();

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message);

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage);
    return;
  }

  socket.addEventListener("open", () => {
      socket.send(stringifiedMessage);
    },
    { once: true }
  );
}
socket.addEventListener("message", e => {
  console.log(JSON.parse( e.data));
  const dataFromMessage = JSON.parse( e.data);
  let name;

  if(dataFromMessage.MESSAGE === 'INVALID_SUB'){
    name = dataFromMessage.PARAMETER.split('~')[dataFromMessage.PARAMETER.split('~').length - 2];
   (tickersHandlers.get(name) || []).forEach(fn => fn('-', false));
   // console.log(name);
  }

  const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = dataFromMessage;
  const handlers = tickersHandlers.get(currency) || [];
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    // tickersHandlers.get(currency) || [].forEach(fn => fn('-', JSON.parse( e.data).MESSAGE === 'INVALID_SUB' ? false : true));
    return;
  }

  handlers.forEach(fn => fn(newPrice, true));

});

function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`]
  }, ticker);
}

function unsubscribeFromTickerOnWs(ticker) {

  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`]
  });
}



const subscribeToTicker = (ticker, cb) => {
	const currentTickerHandlers = tickersHandlers.get(ticker) || [];
	tickersHandlers.set(ticker, [...currentTickerHandlers, cb]);
	subscribeToTickerOnWs(ticker);
  console.log(tickersHandlers)
}

const unsubscribeFromTicker = (ticker) => {
	tickersHandlers.delete(ticker);
	unsubscribeFromTickerOnWs(ticker);
}
const stopUpdate = () => {
	console.log('stopUpdate');
	socket.close();
}

export {subscribeToTicker, unsubscribeFromTicker, stopUpdate };