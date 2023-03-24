<script>
import Icon from 'svelte-awesome';
import ticket from 'svelte-awesome/icons/ticket';
import {isDarkModeValue} from '../store/store';
export let isDarkMode = false;

$:isDarkModeValue.set(isDarkMode)



</script>

<header class="d-flex justify-between">
    <h5 class="logo-text d-flex"><Icon scale="2" data={ticket}/> 
         <span class="ml-2">Udaan</span>
    </h5>
    <label class="checkgroup" for="toggle">
        <span class="checkbox">
            <input name="toggle" id="toggle" type="checkbox" bind:checked={$isDarkModeValue}>
            <span class="checkmark"></span>
        </span>
    </label>
 </header>

<style type="text/scss">
@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";

header{
   &.justify-between{
        justify-content: space-between;
    }
}
.logo-text{
        color: $text-white;
        font-family: $reg-italic-pb;
        font-size: $_header-logo-lg;
        letter-spacing: 1.2px;
    }
$dark: #1f1f27;
$gray-dark: #353746;
$gray: #545E75;
$gray-light: #f0eff3;
$white: #ffffff;
$red: #f8174b;
$orange: #f46036;
$green: #00F260;
$blue: #0575E6;
$offwhite: #f9f9fc;
$transition: all .2s ease-in-out;

@mixin size($width, $height: $width) {
	width: $width;
	height: $height;
}
    .checkgroup {
	display: block;
	cursor: pointer;
	padding: 1rem 1.3rem;

	.checkbox {
		display: block;
		position: relative;
		width: 2.5rem;
		height: 0.5rem;
		background: linear-gradient(130deg, $green, $blue);
		border-radius: 25px;

		input[type="checkbox"] {
			position: absolute;
			opacity: 0;
			visibility: hidden;

			&:checked ~ .checkmark {
				top: -0.8rem;
				left: 1.5rem;
			}
		}

		.checkmark {
			display: block;
			position: absolute;
			@include size(2.2rem);
			background: $gray;
			border-radius: 50%;
			top: -0.8rem;
			left: -1rem;
			transition: $transition;
			
			&.light {
				background: $gray-light;
				
				&::before {
					color: $gray;
				}
			}

			&::before {
				font-family: "Font Awesome 5 Free";
				color: $white;
				content: "\f186";
				font-size: 0.8rem;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
}
</style>