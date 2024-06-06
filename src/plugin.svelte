<div class="plugin__mobile-header">
    { title }
</div>
<section bind:this={pluginElement} class="plugin__content">
    <div
        class="plugin__title plugin__title--chevron-back"
        on:click={ () => bcast.emit('rqstOpen', 'menu') }
    >
    { title }
    </div>
    <h3>Click on the map to get a circle of 400 km radius and the 6char maidenhead locator.
    Mostly useful for RainScatter cloud location using the "Radar" map.
    </h3>
    <h2>
    </h2>
    <hr />
</section>
<script lang="ts">
    import bcast from "@windy/broadcast";
    import { map, centerMap, markers } from '@windy/map';
    import { singleclick } from '@windy/singleclick';
    import { getMyLatestPos } from "@windy/geolocation";
    import { setUrl } from "@windy/location";

    import { onDestroy, onMount } from 'svelte';

    import config from './pluginConfig';

    import type { LatLon } from '@windy/interfaces';

    const { name, title } = config;

    let marker: L.Marker | null = null;
    let circle: L.Circle | null = null;

    let selected = 0;
    let selectedLat: number = 50;
    let selectedLon: number = 14;

    let range = 400
    let pluginElement;

    const calculateMaidenheadLocator = ( latLon: LatLon ) => {
        const { lat, lon } = latLon ;

        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
        throw new Error("Latitude must be between -90 and 90 and longitude between -180 and 180.");
        }

        // Convert latitude and longitude to positive values for easier calculation
        let adjLat = lat + 90;
        let adjLon = lon + 180;

        // Calculate the first two characters
        let A = Math.floor(adjLon / 20);
        let B = Math.floor(adjLat / 10);
        let field = String.fromCharCode(65 + A) + String.fromCharCode(65 + B);

        // Calculate the second pair of characters
        let C = Math.floor((adjLon % 20) / 2);
        let D = Math.floor(adjLat % 10);
        let square = C.toString() + D.toString();

        // Calculate the third pair of characters
        let E = Math.floor(((adjLon % 2) * 60) / 5);
        let F = Math.floor(((adjLat % 1) * 60) / 2.5);
        let subsquare = String.fromCharCode(97 + E) + String.fromCharCode(97 + F);
        let locator = field + square + subsquare;
        const divEl = pluginElement.querySelector('h2');
        divEl.innerHTML = locator;
    }

    const removeMapItems = () => {
        if(marker) {
            marker.remove();
            marker = null;
        }
        if(circle) {
            circle.remove();
            circle = null;
        }
    }

    const drawMarkerAndCircle = ( latLon: LatLon, range: number) => {
        removeMapItems();

        const { lat, lon } = latLon ;
        marker = new L.Marker({ lat, lng: lon },{ icon: markers.pulsatingIcon }).addTo(map);
        circle = new L.Circle({ lat, lng: lon }, { radius: range * 1000 }).addTo(map);

    }

    $: setUrl( name, { lat: selectedLat, lon: selectedLon });

    $: drawMarkerAndCircle({ lat: selectedLat, lon: selectedLon }, range );

    const setLocation = (latLon: LatLon) => {
        const { lat, lon } = latLon;
        selectedLat = lat;
        selectedLon = lon;

        removeMapItems();
        $: calculateMaidenheadLocator({ lat: selectedLat, lon: selectedLon });

    }

    export const onopen = (params?: LatLon) => {

        if(!params) {
            params = getMyLatestPos();
        }

        const { lat, lon } = params;
        centerMap({ lat, lon, zoom: 3});
        setLocation(params);
    };

    onMount(() => {
        singleclick.on(name, setLocation)
    });

    onDestroy(() => {
        removeMapItems();
        singleclick.off(name, setLocation);
    });

</script>

<style lang="less">
    .card {
        &.selected {
            border: 2px solid darkorange;
        }
    }
    p {
        line-height: 1.8;
    }
</style>

