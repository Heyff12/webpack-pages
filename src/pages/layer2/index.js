import tpl from './layer.tpl';
import './layer.less';



const App = function() {
    var dom = document.getElementById('app');
    dom.innerHTML = tpl({
        name: 'layer22222222222222222222222222222',
        arr: ['xiaomi', 'apple', 'pear']
    });
}
new App()
