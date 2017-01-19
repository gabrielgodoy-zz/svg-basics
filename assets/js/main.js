import '../style/main.styl';
import 'bootstrap/dist/css/bootstrap.min.css';
import {initArcs} from './arcs';

document.addEventListener('DOMContentLoaded', function() {
  if(document.getElementById('svgcontext')) {
    initArcs();
  }
});
