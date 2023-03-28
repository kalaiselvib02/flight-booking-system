<script>
import Icon from 'svelte-awesome';
import ticket from 'svelte-awesome/icons/ticket';
import {isDarkModeValue} from '../store/store';
import {APP_CONSTANTS} from "../constants/constants"
    import App from '../App.svelte';
export let isDarkMode = false;
export let showHeaderBg

$:isDarkModeValue.set(isDarkMode)




$:isDarkMode = $isDarkModeValue



</script>

<header class="d-flex justify-between" class:bg-primary={showHeaderBg}>
    <h5 class="logo-text d-flex"><Icon scale="2" data={ticket}/> 
         <span class="ml-2">Udaan</span>
    </h5>
	<div class="d-flex align-center"  class:d-none={!showHeaderBg}>
		<p class="mb-0 text-white">{APP_CONSTANTS.THEME.LIGHT_THEME}</p>
    <label class="checkgroup" for="toggle">
		
        <span class="checkbox">
            <input name="toggle" id="toggle" type="checkbox" bind:checked={$isDarkModeValue}>
            <span class="checkmark"></span>
        </span>
	
    </label>
	<p class="mb-0 text-white" >{APP_CONSTANTS.THEME.DARK_THEME}</p>
	</div>
 </header>

<style type="text/scss">
@import "../scss/fonts/_fonts.scss";
@import "../scss/mixins/_mixins.scss";
@import "../scss/variables/_variables.scss";
@import "../scss/style.scss";

header{
	padding: 1rem 0.8rem;
   &.justify-between{
        justify-content: space-between;
    }
	.align-center{
		align-items: center;
	}
	&.bg-primary{
		background-color: $text-primary;
	}
}
.logo-text{
        color: $text-white;
        font-family: $reg-italic-pb;
        font-size: $_header-logo-lg;
        letter-spacing: 1.2px;
    }



    .checkgroup {
	display: block;
	cursor: pointer;
	padding: 1rem 1.3rem;

	.checkbox {
		display: block;
		position: relative;
		width: 2.3rem;
		height: 0.2rem;
		background: #fff;
		border-radius: 25px;

		input[type="checkbox"] {
			position: absolute;
			opacity: 0;
			visibility: hidden;

			&:checked ~ .checkmark {
				top: -0.4rem;
				left: 1rem;
			}
		}

		.checkmark {
			display: block;
			position: absolute;
			@include size(0.9rem);
			background:#3d6da5;
			border-radius: 50%;
			top: -0.4rem;
			left: 0rem;
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