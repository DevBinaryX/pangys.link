import { readable } from 'svelte/store';

const fetchLanyard = () => {
	const json = fetch('https://api.lanyard.rest/v1/users/869501647548743720').then((r) => r.json());
	console.log(json);
	return json;
};

const LanyardData = readable(fetchLanyard());
console.log(LanyardData);
export default LanyardData;
