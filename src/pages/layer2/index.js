import tpl from './layer.tpl';
import './layer.less';



const App = function() {
    var dom = document.getElementById('app');
    dom.innerHTML = tpl({
        name: 'layertest22222222222222222222222222222',
        arr: ['xiaomi', 'apple', 'pear', 'orange']
    });
}
new App()
