"use strict";
class TaxonomyFilter {
    /**
     * Create eventhandlers for 'Search' and 'Reset' buttons
     */
    initEventHandlers() {
        const submitBtn = document.querySelector('#taxonomy-filter #submit');
        if (!submitBtn) {
            throw new Error('Could not find button "#taxonomy-filter #submit"');
        }
        const resetBtn = document.querySelector('#taxonomy-filter #reset');
        if (!resetBtn) {
            throw new Error('Could not find button "#taxonomy-filter #reset"');
        }
        // 'Submit' button adds Taxonomy filters to the url and navigates to it
        submitBtn.addEventListener('click', (event) => {
            event.preventDefault();
            let path = taxonomyFilter.route;
            path = this.addFiltersToPath(path);
            window.location.href = path;
        });
        // 'Reset' button clears all checkboxes and navigates to url without Taxonumy filters
        resetBtn.addEventListener('click', (event) => {
            event.preventDefault();
            const path = taxonomyFilter.route;
            window.location.href = path;
        });
    }
    /**
     * Create url for current page with Taxonomy filters appended to it
     *
     * @param pathname Url to the page without Taxonomy filters
     * @returns Url with Taxonomy parameters, eg. "/tag:photograpy,city"
     */
    addFiltersToPath(pathname) {
        const form = document.getElementById('taxonomy-filter');
        const checkBoxes = form.querySelectorAll('[taxon]');
        const fieldValues = {};
        for (const checkbox of checkBoxes) {
            if (!checkbox.checked) {
                continue;
            }
            const taxon = checkbox.getAttribute('taxon');
            const value = checkbox.getAttribute('taxonvalue');
            if (!fieldValues[taxon]) {
                fieldValues[taxon] = '';
            }
            fieldValues[taxon] += (fieldValues[taxon] ? `,${value}` : value);
        }
        const operator = form.querySelector('input[name="operator"]:checked');
        if (operator) {
            fieldValues['operator'] = operator.value;
        }
        const startDate = form.querySelector('#starts-after');
        const endDate = form.querySelector('#ends-before');
        if (startDate && startDate.value !== '') {
            fieldValues['starts-after'] = startDate.value;
        }
        if (endDate && endDate.value !== '') {
            fieldValues['ends-before'] = endDate.value;
        }
        let params = '';
        for (const entry of Object.entries(fieldValues)) {
            params += `/${entry[0]}:${entry[1]}`;
        }
        return (pathname + params).replace(/\/\//g, '/');
    }
}
new TaxonomyFilter().initEventHandlers();
//# sourceMappingURL=taxonomy-filter.js.map