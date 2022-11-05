declare const taxonomyFilters: { blog: string, items: string };

class TaxonomyFilter {

    /**
     * Create eventhandlers for 'Search' and 'Reset' buttons
     */
    public initEventHandlers(): void {

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

            let path = this.getCollectionPath();
            path = this.addFiltersToPath(path);

            window.location.href = path;
        });

        // 'Reset' button clears all checkboxes and navigates to url without Taxonumy filters
        resetBtn.addEventListener('click', (event) => {
            event.preventDefault();

            const path = this.getCollectionPath();

            window.location.href = path;
        })
    }

    /**
     * Get the relative path of the page containing the collection to filter.
     * 
     * @returns The relative path to page containing the collection.
     */
    protected getCollectionPath(): string {
        return taxonomyFilters.blog;
    }

    /**
     * Create url for current page with Taxonomy filters appended to it
     * 
     * @param pathname Url to the page without Taxonomy filters
     * @returns Url with Taxonomy parameters, eg. "/tag:photograpy,city"
     */
    protected addFiltersToPath(pathname: string): string {
        const form = document.getElementById('taxonomy-filter') as HTMLFormElement;
        const checkBoxes = form.querySelectorAll('[taxon]') as NodeListOf<HTMLInputElement>;

        const fieldValues = {} as any;

        for (const checkbox of checkBoxes) {
            if (!checkbox.checked) {
                continue;
            }

            const taxon = checkbox.getAttribute('taxon') as string;
            const value = checkbox.getAttribute('taxonvalue');

            if (!fieldValues[taxon]) {
                fieldValues[taxon] = '';
            }

            fieldValues[taxon] += (fieldValues[taxon] ? `,${value}` : value);
        }
        
        const startDate = form.querySelector('#starts-after') as HTMLInputElement | null;
        const endDate = form.querySelector('#ends-before') as HTMLInputElement | null;

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