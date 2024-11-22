import { ComponentFixture, TestBed } from "@angular/core/testing"
import { NotFoundComponent } from "./not-found.component"
import { DebugElement } from "@angular/core"
import { Title } from "@angular/platform-browser"


describe("NotFoundComponent", () => {
    let component: NotFoundComponent
    let fixture: ComponentFixture<NotFoundComponent>
    let debugEle: DebugElement
    let title: Title

    beforeEach(() => {

        TestBed.configureTestingModule({
            declarations: [NotFoundComponent],
            providers: [Title]
        })
        fixture = TestBed.createComponent(NotFoundComponent)
        component = fixture.componentInstance
        debugEle = fixture.debugElement
        title = TestBed.inject(Title)
    })

    it("Should create component", () => {
        expect(component).toBeTruthy()
    })

    it("should set the title to Not Found", () => {
        fixture.detectChanges()
        expect(document.title).toBe("Not Found")
    })


})