<script>
export let tooltipText
</script>


<div class="tooltip">
    <span class="tooltiptext">{tooltipText}</span>
  </div>

<style>
    .tooltip {
  position: relative;
  display: inline-block;
 
}

.tooltip .tooltiptext {  
  background-color: #ea6d6d;
  color: #fff;
  text-align: center;
  padding: 10px;
  position: absolute;
  z-index: 1;
  top: 20%;
  left: 10%;
  font-size: 0.8rem;
 
}
.tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: -26%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #ea6d6d transparent;
}

</style>