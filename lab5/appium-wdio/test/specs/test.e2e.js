import { expect, $, driver } from '@wdio/globals';
import { keyevent } from 'appium-uiautomator2-driver/build/lib/commands/keyboard';
import { Key } from 'webdriverio'

describe('ApiDemos tests', () => {
    
    beforeEach(async () => {
        await driver.activateApp('io.appium.android.apis');
    });

    afterEach(async () => {
        await driver.terminateApp('io.appium.android.apis');
    });
    

    it('country test', async () => {
        //const views = await $('~Views');// accesibility id selector
        //await views.click();
        await $('~Views').click();
        const autocomplete = await $('android=new UiSelector().text("Auto Complete")')//ui automation selector
        await autocomplete.click(); 

        const country = await $('//android.widget.TextView[@content-desc="1. Screen Top"]')// xpath selector
        await country.click();

        const text_input = await $('android=new UiSelector().resourceId("io.appium.android.apis:id/edit")');
        await text_input.setValue("Mexico");

        const result = await text_input.getText();
        await expect(result).toBe('Mexico');

    });

    it('date dial test', async () => {
        const views = await $('~Views');
        await views.click();

        await $('android=new UiSelector().text("Date Widgets")').click(); 
        await $('//android.widget.TextView[@content-desc="2. Inline"]').click();

        const time_handler_hour = await $('//android.widget.TextView[@resource-id="android:id/hours"]');
        const time_handler_minute = await $('//android.widget.TextView[@resource-id="android:id/minutes"]');

        await $('//android.widget.RadialTimePickerView.RadialPickerTouchHelper[@content-desc="8"]').click();
        await $('//android.widget.RadialTimePickerView.RadialPickerTouchHelper[@content-desc="45"]').click();

        const result = await time_handler_hour.getText() + ':' + await time_handler_minute.getText();
        await expect(result).toBe('8:45');
    })

    it('afinity nesting, idk', async () => {
        await $('~App').click();

        await $('~Activity').click(); 
        await $('~Finish Affinity').click();

        const button = await $('~Nest some more');

        for (let i = 0; i < 3; i++) {
            await button.click();
        }

        const lable = await $('//android.widget.TextView[@resource-id="io.appium.android.apis:id/seq"]');

        const result = await lable.getText();
        await expect(result).toBe('Current nesting: 4');
    })
});
/*
import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page.js'
import SecurePage from '../pageobjects/secure.page.js'

describe('My Login application', () => {
    it('should login with valid credentials', async () => {
        await LoginPage.open()

        await LoginPage.login('tomsmith', 'SuperSecretPassword!')
        await expect(SecurePage.flashAlert).toBeExisting()
        await expect(SecurePage.flashAlert).toHaveText(
            expect.stringContaining('You logged into a secure area!'))
    })
})

*/