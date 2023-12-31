<script>
	import HeroTitle from '../components/atoms/HeroTitle.svelte';
	import SocialsHost from '../components/molecules/SocialsHost.svelte';
	import Hero from '../components/molecules/Hero.svelte';
	import RichPresence from '../components/molecules/RichPresence.svelte';
	import { onMount } from 'svelte';
	import {
		hexFromArgb,
		Hct,
		DynamicScheme,
		sourceColorFromImage,
		MaterialDynamicColors,
		TonalPalette,
		DislikeAnalyzer,
		TemperatureCache
	} from '@material/material-color-utilities';

	onMount(async () => {
		const avatar = document.querySelector('.logo');

		if (avatar.complete) {
			getColors().then((scheme) => {
				setColors(scheme);
			});
		} else {
			avatar.onload = async () => {
				await getColors().then((scheme) => {
					setColors(scheme);
				});
			};
		}

		async function getColors() {
			const sourceColor = await sourceColorFromImage(avatar);
			const sourceColorHct = Hct.fromInt(sourceColor);

			const dynamicScheme = new DynamicScheme({
				sourceColorArgb: sourceColorHct,
				variant: 6,
				contrastLevel: 0,
				isDark: true,
				primaryPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, sourceColorHct.chroma),
				secondaryPalette: TonalPalette.fromHueAndChroma(
					sourceColorHct.hue,
					Math.max(sourceColorHct.chroma - 32.0, sourceColorHct.chroma * 0.5)
				),
				tertiaryPalette: TonalPalette.fromInt(
					DislikeAnalyzer.fixIfDisliked(
						new TemperatureCache(sourceColorHct).analogous(3, 6)[2]
					).toInt()
				),
				neutralPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 15.0),
				neutralVariantPalette: TonalPalette.fromHueAndChroma(sourceColorHct.hue, 2.0)
			});

			const getDynamicColor = (name) => {
				return MaterialDynamicColors[name].getArgb(dynamicScheme);
			};
			const scheme = Object.fromEntries(
				['primary', 'onPrimary', 'background', 'onBackground'].map((key) => [
					key,
					hexFromArgb(getDynamicColor(key))
				])
			);
			return scheme;
		}

		function setColors(theme) {
			document.documentElement.style.setProperty('--background-color', theme.background);
			document.documentElement.style.setProperty('--primary', theme.primary);
			document.documentElement.style.setProperty('--secondary', theme.onPrimary);
			document.documentElement.style.setProperty('--white', theme.onBackground);
		}
	});
</script>

<div class="center">
	<div class="wrapper">
		<Hero />
		<div class="introduction-container">
			<HeroTitle />
			<span class="introduction">
				Just a random high school student who tinkering with random stuff.
			</span>
			<div class="social-buttons">
				<SocialsHost />
			</div>
			<RichPresence />
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		min-height: -webkit-fill-available;
		min-height: -moz-available;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--background-color);
	}

	:global(html) {
		height: -webkit-fill-available;
		height: -moz-available;
	}

	:root {
		--background-color: #130f14;
		--white: #d1d0d0;
		--primary: #5d4b64;
		--secondary: #261f29;
		--font-one: 'Space Grotesk', sans-serif;
		--font-two: 'JetBrains Mono', monospace;
	}

	.wrapper {
		display: flex;
		max-width: 100vw;
		height: 100%;
	}

	.center {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.introduction-container {
		display: flex;
		justify-content: center;
		flex-direction: column;
		gap: 2rem;
		color: var(--primary);
		font-family: var(--font-one);
	}

	.introduction-container .introduction {
		color: var(--white);
		font-size: 1.3rem;
		font-weight: 300;
	}

	@media (max-width: 868px) {
		.wrapper {
			flex-direction: column;
			gap: 2rem;
			width: min(90%, 65rem) !important;
		}

		.introduction-container {
			align-items: center;
			font-family: var(--font-one);
			font-size: 6px;
		}

		.introduction-container .introduction {
			text-align: center;
			font-size: 16px;
			padding-right: 0;
			width: 90%;
		}

		.social-buttons {
			width: 100%;
			display: flex;
			justify-content: center;
			gap: 1rem;
			align-items: center;
		}
	}
</style>
